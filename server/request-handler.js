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
  const {id, username, text, roomname} = JSON.parse(body);
  const message = {
    id,
    username,
    text,
    roomname
  };
  message.id = messages.length + 1;
  return message;
};

var requestHandler = function(request, response) {
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var headers = defaultCorsHeaders;
  if (request.url === '/classes/messages' && (request.method === 'GET' || request.method === 'OPTIONS')) {
    response.writeHead(200, headers);
    response.end(JSON.stringify(messages));
  } else if (request.url === '/classes/messages' && request.method === 'POST') {
    var body = '';
    request.on('data', (chunk) => {
      body += chunk.toString();
    }).on('end', () => {
      var message = getPostMessage(body);
      messages.push(message);
      response.writeHead(201, headers);
      response.end(JSON.stringify(messages));
    });
  } else {
    response.writeHead(404, headers);
    response.end(JSON.stringify({ message: 'Route Not Found' }));
  }
};

module.exports = { requestHandler };