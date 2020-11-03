const { subscribe } = require('./kafkaService')

const topic = process.argv[2]
console.log(`Starting consumer on topic: ${topic}`)

const handler = data => {
  console.log(`${topic} data:\t`, JSON.stringify(data))
}
subscribe([{ topic, fn: handler }])

console.log('Ctrl + C to exit')
