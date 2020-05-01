'use strict'
const Telegraf = require('telegraf')
const { get, incr, set } = require('./src/db/index')
const bot = new Telegraf(process.env.BOT_TOKEN)

bot.hears('hi', (ctx) => ctx.reply('Hey there!'))

module.exports.main = async (event) => {
  await set('test', 1)
  await incr('test')
  await get('test')
  let response
  const input = JSON.parse(event.body)
  try {
    await bot.handleUpdate(input)
    response = {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Bot informed about this input correctly',
        input: event,
      }),
    }
  } catch (e) {
    console.error(e)
    response = {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error processing bot input...',
        error: e,
        input: event,
      }),
    }
  }
  return response
}
