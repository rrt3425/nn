const mineflayer = require('mineflayer')
const fs = require('fs')

if (process.argv.length < 4 || process.argv.length > 6) {
  console.log('Usage : node reconnector.js <host> <port> [<file>] [<password>]')
  process.exit(1)
}

function createBot (username) {
  const bot = mineflayer.createBot({
    host: process.argv[2],
    port: parseInt(process.argv[3]),
    username: username,
    password: process.argv[5]
  })

  bot.on('error', (err) => console.log(err))
  bot.on('end', () => {
    console.log(`Disconnected from the server. Reconnecting with username "${username}" in 10 seconds...`)
    setTimeout(() => createBot(username), 4000) // Задержка в 10 секунд перед переподключением
  })
}

const filename = process.argv[4]
fs.readFile(filename, 'utf8', (err, data) => {
  if (err) {
    console.log(`Error reading file: ${err}`)
    process.exit(1)
  }

  const usernames = data.split('\n').map(line => line.trim())
  usernames.forEach(username => createBot(username))
})
