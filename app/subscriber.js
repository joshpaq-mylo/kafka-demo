const { subscribe } = require('./kafkaService')

const topic = process.argv[2]
console.log(`Starting consumer on topic: ${topic}`)

subscribe(topic, data => {
  console.log(`${topic} data:\t`, JSON.stringify(data))
})

console.log('Ctrl + C to exit')
// while (true) {
//   setTimeout(() => {}, 100)
// }
