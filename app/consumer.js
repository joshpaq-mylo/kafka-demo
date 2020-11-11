const { subscribe } = require('./kafkaService')

const topic = process.argv[2]
console.log(`Starting consumer on topic: ${topic}`)

const handler = data => {
  console.log(`Message on: ${data.topic}`)
  console.log('Headers:', JSON.stringify(data.headers, null, 2))
  console.log('Data:', JSON.stringify(data.value, null, 2))
}
subscribe([{ topic, fn: handler }])

console.log('Ctrl + C to exit')
