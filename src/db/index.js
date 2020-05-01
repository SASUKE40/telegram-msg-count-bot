const AWS = require('aws-sdk')

AWS.config.update({
  region: 'localhost',
  endpoint: 'http://localhost:8000',
})

const docClient = new AWS.DynamoDB.DocumentClient()
/**
 * dynamodb table name
 * @type {string}
 */
const table = 'TelegramMsgCount'

/**
 * get data by uid
 * @param uid
 * @returns {Promise<object>}
 */
module.exports.get = async (uid) => {
  const params = {
    TableName: table,
    Key: {
      uid,
    },
  }
  return new Promise((resolve, reject) => {
    docClient.get(params, function (err, data) {
      if (err) {
        reject(err)
        console.error(
          'Unable to read item. Error JSON:',
          JSON.stringify(err, null, 2)
        )
      } else {
        resolve(data)
        console.log('GetItem succeeded:', JSON.stringify(data, null, 2))
      }
    })
  })
}

/**
 * incr count
 * @param uid
 * @returns {Promise<object>}
 */
module.exports.incr = async (uid) => {
  const params = {
    TableName: table,
    Key: {
      uid,
    },
    UpdateExpression: 'set msg_count = msg_count + :val',
    ExpressionAttributeValues: {
      ':val': 1,
    },
    ReturnValues: 'UPDATED_NEW',
  }
  return new Promise((resolve, reject) => {
    docClient.update(params, function (err, data) {
      if (err) {
        reject(err)
        console.error(
          'Unable to update item. Error JSON:',
          JSON.stringify(err, null, 2)
        )
      } else {
        resolve(data)
        console.log('UpdateItem succeeded:', JSON.stringify(data, null, 2))
      }
    })
  })
}

module.exports.set = async (uid, msg_count) => {
  const params = {
    TableName: table,
    Item: {
      uid,
      msg_count,
    },
  }
  return new Promise((resolve, reject) => {
    docClient.put(params, function (err, data) {
      if (err) {
        reject(err)
        console.error(
          'Unable to add item. Error JSON:',
          JSON.stringify(err, null, 2)
        )
      } else {
        resolve(data)
        console.log('Added item:', JSON.stringify(data, null, 2))
      }
    })
  })
}
