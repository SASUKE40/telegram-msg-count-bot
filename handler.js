'use strict';
const Telegraf = require('telegraf');
const bot = new Telegraf(process.env.BOT_TOKEN);
const AWS = require('aws-sdk');

bot.hears('hi', ctx => ctx.reply('Hey there!'));

module.exports.hello = async event => {
    const dynamodb = new AWS.DynamoDB({
        region: 'localhost',
        endpoint: 'http://localhost:8000',
    });
    const params = {
        RequestItems: {
            TelegramMsgCount: [
                {
                    PutRequest: {
                        Item: {
                            uid: {
                                HASH: "test"
                            },
                            count: {
                                N: 1
                            }
                        }
                    }
                }
            ]
        }
    };
    dynamodb.batchWriteItem(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log(data);           // successful response
        /*
        data = {
        }
        */
    });

    let response;
    const input = JSON.parse(event.body);
    try {
        await bot.handleUpdate(input);
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Bot informed about this input correctly',
                input: event,
            }),
        };
    } catch (e) {
        console.error(e);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error processing bot input...',
                error: e,
                input: event,
            }),
        };
    }
    return response;

  // Use this code if you don't use the http event with the LAMBDA-PROXY integration
  // return { message: 'Go Serverless v1.0! Your function executed successfully!', event };
};
