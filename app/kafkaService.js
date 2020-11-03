const Kafka = require('node-rdkafka')

const options = require('./common/options')
const clientId = require('../package.json').name

const producerConfig = {
  'client.id': clientId,
  'metadata.broker.list': options.kafka.host
}

const consumerConfig = {
  'group.id': clientId,
  'metadata.broker.list': options.kafka.host,
  'enable.auto.commit': false
}

function init (/* clientId, host */) {
  const producer = new Promise((resolve, reject) => {
    const producer = new Kafka.Producer(producerConfig)

    producer.connect()

    producer.on('ready', () => {
      console.info('Kafka producer ready')
      resolve(producer)
    })

    producer.on('error', (error) => {
      console.error('Kafka producer error', error)
      reject(error)
    })

    producer.on('event.error', (error) => {
      console.error('Kafka producer error', error)
      reject(error)
    })
  })

  const consumer = new Promise((resolve) => {
    const consumer = new Kafka.KafkaConsumer(consumerConfig)

    consumer.connect()

    consumer.on('ready', () => {
      console.info('Kafka consumer ready')
      resolve(consumer)
    })
  })

  return {
    publish: async (topic, message, headers) => {
      return producer.then((producer) => producer.produce(topic, null, Buffer.from(message), null, null, null, headers))
    },
    // every time we sub maybe we should add the subs to a list and restart the sub?
    subscribe: async (subscriptions) => {
      return consumer.then((consumer) => {
        const flatSubscriptions = subscriptions.reduce((topics, { topic, fn }) => {
          topics[topic] = fn
          return topics
        }, {})
        const topics = Object.keys(flatSubscriptions)

        consumer.subscribe(topics)

        console.debug(`Kafka subscriptions registered for the following topics [${topics.join(', ')}.]`)

        consumer.consume()

        consumer.on('data', async (message) => {
          try {
            console.debug(`Kafka message received on topic [${message.topic}]`)

            // headers and value are a buffer so we convert them here and flatten headers
            const value = JSON.parse(message.value.toString())
            const headers = (message.headers || []).reduce((convertedHeaders, header) => {
              Object.keys(header).forEach(key => {
                convertedHeaders[key] = header[key].toString()
              })
              return convertedHeaders
            }, {})

            const subscriptionFn = flatSubscriptions[message.topic]

            if (!subscriptionFn) {
              console.error(`No subscription found for incoming kafka message with topic ${message.topic}`)
              return
            }

            await subscriptionFn({
              ...message,
              value,
              headers
            })
          } catch (e) {
            console.warn(`There was an error processing message for topic ${message.topic}`, e)
          } finally {
            // always commit after everything is done even after an error this way we don't just run an erroring message over and over again
            consumer.commit()
          }
        })
      })
    }
  }
}

module.exports = {
  ...init()
}
