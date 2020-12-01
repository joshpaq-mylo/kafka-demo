const options = require('./common/options')
const { Consumer } = require('@mylo/kafka-utils')

const main = async () => {
  const consumer = new Consumer(require('../package.json').name, options.kafka.host)
  await consumer.init()

  const topic = process.argv[2]
  console.log(`Starting consumer on topic: ${topic}`)

  const handler = data => {
    console.log(`Message on: ${data.topic}`)
    console.log('Headers:', JSON.stringify(data.headers, null, 2))
    console.log('Data:', JSON.stringify(data.value, null, 2))
  }

  await consumer.subscribe([{ topic, fn: handler }])
}

main()
console.log('Ctrl + C to exit')
