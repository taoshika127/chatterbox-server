var http = require('http');
const Message = require('./messagesModel.js');

var getPostData = function(req) {
  return new Promise((resolve, reject) => {
    try {
      let body = '';

      req.on('data', (chunk) => {
        body += chunk.toString();
      });

      req.on('end', () => {
        resolve(body);
      });
    } catch (error) {
      reject(err);
    }
  });
};

async function readAll(req, res) {
  try {
    const messages = await Message.readAll()
    console.log('Im in messageController now!')
    res.writeHead(200, { 'Content-Type': 'application/json' })
    console.log('end', JSON.stringify(messages));
    res.end(JSON.stringify(messages))
    console.log('ended', res._ended);
  } catch (error) {
    console.log(error);
  }
};

async function create(req, res) {
  try {
    const body = await getPostData(req)

    const { username, text } = JSON.parse(body);

    const message = {
      username,
      text
    }

    const newMessage = await Message.create(message)

    res.writeHead(201, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(newMessage))


  } catch (error) {
    console.log(error)
  }
}

module.exports = {readAll, create};

