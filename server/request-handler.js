/*************************************************************

You should implement your request handler function in this file.

requestHandler is already getting passed to http.createServer()
in basic-server.js, but it won't work as is.

You'll have to figure out a way to export this function from
this file and include it in basic-server.js so that it actually works.

*Hint* Check out the node module documentation at http://nodejs.org/api/modules.html.

**************************************************************/
const { readAll, create } = require('./messageController');
const messages = require('./data/messages.json');

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10, // Seconds.
  'Content-Type': 'applicatoin/json'
};
var requestHandler = function(request, response) {
  // Request and Response come from node's http module.
  //
  // They include information about both the incoming request, such as
  // headers and URL, and about the outgoing response, such as its status
  // and content.
  //
  // Documentation for both request and response can be found in the HTTP section at
  // http://nodejs.org/documentation/api/

  // Do some basic logging.
  //
  // Adding more logging to your server can be an easy way to get passive
  // debugging help, but you should always be careful about leaving stray
  // console.logs in your code.
  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var headers = defaultCorsHeaders;
  // if (request.url === '/classes/messages' && request.method === 'POST') {
  //   statusCode = 201;
  //   response.writeHead(statusCode, headers);


  //   response.end(JSON.stringify(response.data));
  // } else if (request.url.pathname === '/classes/messages' && request.method === 'GET') {
  //   statusCode = 200;

  // } else {
  //   statusCode = 404;
  // }
  if (request.url === '/classes/messages' && request.method === 'GET') {

    response.writeHead(200, headers);
    console.log('get 200 successful');
    //readAll(request, response);
    response.end(JSON.stringify(messages));
  } else if (request.url === '/classes/messages' && request.method === 'POST') {
    //console.log('post 201 successful');
    response.writeHead(201, headers);
    var body = '';
    request.on('data', (chunk) => {
      console.log('chunk', chunk.toString());
      body += chunk.toString();
    }).on('end', () => {
      const { username, text } = JSON.parse(body);
      const message = {
        username,
        text
      };
      messages.push(message);
      response.writeHead(201, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(message));
    });

  } else {
    response.writeHead(404, { 'Content-Type': 'application/json' });
    response.end(JSON.stringify({ message: 'Route Not Found' }));
  }
  // The outgoing status.


  // See the note below about CORS headers.
  //var headers = defaultCorsHeaders;

  // Tell the client we are sending them plain text.
  //
  // You will need to change this if you are sending something
  // other than plain text, like JSON or HTML.
  //headers['Content-Type'] = 'applicatoin/json';

  // .writeHead() writes to the request line and headers of the response,
  // which includes the status and all headers.
 // response.writeHead(statusCode, headers);


  // Make sure to always call response.end() - Node may not send
  // anything back to the client until you do. The string you pass to
  // response.end() will be the body of the response - i.e. what shows
  // up in the browser.
  //
  // Calling .end "flushes" the response's internal buffer, forcing
  // node to actually send all the data over to the client.
  //response.end(JSON.stringify(response.outputData));
  //response.end(JSON.stringify('hello world'));
};

// These headers will allow Cross-Origin Resource Sharing (CORS).
// This code allows this server to talk to websites that
// are on different domains, for instance, your chat client.
//
// Your chat client is running from a url like file://your/chat/client/index.html,
// which is considered a different domain.
//
// Another way to get around this restriction is to serve you chat
// client from this domain by setting up static file serving.


module.exports = { requestHandler };