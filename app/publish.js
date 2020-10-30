const { publish } = require('./kafkaService')

const topic = process.argv[2]

const message = process.argv[3]
console.log(`Publishing '${message}'`)
console.log(`On topic: ${topic}`)

publish(topic, message)
