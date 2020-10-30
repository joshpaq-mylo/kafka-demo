const { KafkaClient, Producer, Consumer } = require('kafka-node')

const options = require('./common/options')

const createClient = host => new KafkaClient({ kafkaHost: host })

const publish = (topic, message) => {
  const producer = new Producer(createClient(options.kafka.host))

  producer.on('ready', () => {
    console.log('producer ready')
    // lookup what refresh metadata does
    /*
    client.refreshMetadata([topic], (error) => {
      if (error) {
        throw error
      }
      console.log(`Sending message to ${topic}: ${JSON.stringify(message)}`)
      producer.send([{ topic, messages: [message] }], (err, result) => {
        console.log(err || result)
      })
    }) */

    producer.send([{ topic, messages: [JSON.stringify(message)] }], (err, result) => {
      // throw on error so we can respond to it, since we usually use a transactional outbox this would
      // mean we would NOT delete the message from the outbox since we want to guarantee it gets sent
      err ? console.error('Error when sending message from producer.', err)
        : console.log('result', result)
    })
  })
  producer.on('error', (error) => {
    console.error('Producer has thrown an error:', error)
  })
}

const subscribe = (topic, action) => {
  const consumer = new Consumer(createClient(options.kafka.host),
    // topics
    [
      {
        topic: topic,
        partition: 0
      }
    ],
    // options
    {
      autoCommit: false,
      fetchMaxWaitMs: 1000,
      fetchMaxBytes: 1024 * 1024
    })

  consumer.on('message', async (message) => {
    const {
      topic,
      offset
    } = message
    try {
      await action(message)
      // we commit the offset on successfully responding to the event
      // this makes sure we respond to the message AT LEAST ONCE
      consumer.commit((error, data) => {
        if (error) {
          console.error(`Error committing Kafka offset [${offset}] for topic [${topic}]`, error)
        } else {
          console.log(`Successfully committed Kafka offset [${offset}] for topic [${topic}]`, data)
        }
      })
    } catch (error) {
      // don't commit on error
      console.error(`Consumer error performing action on Kafka offset [${offset}] for topic [${topic}]`)
      console.error(error)
    }
  })

  consumer.on('error', (error) => {
    console.error('Consumer has thrown an error', error)
  })
}

module.exports = {
  publish,
  subscribe
}
