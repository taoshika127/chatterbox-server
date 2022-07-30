/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const messages = require('./data/messages.json');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10,
  'Content-Type': 'applicatoin/json'
};

var getPostMessage = function(body) {
  const {username, text, roomname} = JSON.parse(body);
  const message = {
    username,
    text,
    roomname
  };
  message.id = messages.length + 1;
  return message;
};

var sendResponse = (res, data, statusCode, header) => {
  statusCode = statusCode || 200;
  res.writeHead(statusCode, header);
  res.end(JSON.stringify(data));
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var headers = defaultCorsHeaders;
  if (request.url === '/classes/messages') {
    if (request.method === 'GET') {
      sendResponse(response, messages, 200, headers);
    } else if (request.method === 'OPTIONS') {
      sendResponse(response, {}, 200, headers);
    } else if (request.method === 'POST') {
      var body = '';
      request.on('data', (chunk) => {
        body += chunk.toString();
      }).on('end', () => {
        var message = JSON.parse(body);
        message.id = messages.length;
        console.log('message: ', message);
        messages.push(message);
        sendResponse(response, message, 201, headers);
      });
    } else {
      sendResponse(response, { message: 'Method Not Found' }, 404, headers);
    }
  } else {
    sendResponse(response, { message: 'Route Not Found' }, 404, headers);
  }
};

module.exports = { requestHandler };