const options = require('./common/options')
const { Producer } = require('@mylo/kafka-utils')

const main = async () => {
  const producer = new Producer(require('../package.json').name, options.kafka.host)
  await producer.init()

  const topic = process.argv[2]

  const message = process.argv[3]
  console.log(`Publishing '${message}'`)
  console.log(`On topic: ${topic}`)

  const headers = {
    'X-Mylo-Entity-Type': 'Message',
    'X-Mylo-Tenant-Id': 'mylo',
    'X-Mylo-Source': require('../package.json').name
  }

  await producer.publish(topic, { message }, headers)
}

main()
