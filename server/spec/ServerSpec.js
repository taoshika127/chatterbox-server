const { requestHandler } = require('../request-handler');
var expect = require('chai').expect;
var stubs = require('./Stubs');

describe('Node Server Request Listener Function', function() {
  it('Server Should answer GET requests for /classes/messages with a 200 status code', function() {
    // This is a fake server request. Normally, the server would provide this,
    // but we want to test our function's behavior totally independent of the server code
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();
    console.log('reqres', req, res);
    requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    console.log('res._ended', res._ended);
    expect(res._ended).to.equal(true);
  });

  it('Server Should send back parsable stringified JSON', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    requestHandler(req, res);

    expect(JSON.parse.bind(this, res._data)).to.not.throw();
    console.log('res._ended', res._ended);
    expect(res._ended).to.equal(true);
  });

  it('Server Should send back an array', function() {
    var req = new stubs.request('/classes/messages', 'GET');
    var res = new stubs.response();

    requestHandler(req, res);

    var parsedBody = JSON.parse(res._data);
    console.log(res._data);
    expect(parsedBody).to.be.an('array');
    console.log('res._ended', res._ended);
    expect(res._ended).to.equal(true);
  });

  it('Server Should accept posts to /classes/messages', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    requestHandler(req, res);

    // Expect 201 Created response status
    expect(res._responseCode).to.equal(201);

    // Testing for a newline isn't a valid test
    // TODO: Replace with with a valid test
    // expect(res._data).to.equal(JSON.stringify('\n'));
    expect(res._ended).to.equal(true);
  });

  it('Server Should accept more than 1 posts to /classes/messages', function() {
    var stubMsg = {
      username: 'AA',
      text: 'test 2!',
      roomname: 'lobby'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    requestHandler(req, res);
    var messages = JSON.parse(res._data);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[1].username).to.equal('AA');
    expect(messages[1].roomname).to.equal('lobby');
    expect(res._ended).to.equal(true);
  });

  it('Server Should respond with messages that were previously posted', function() {
    var stubMsg = {
      username: 'Jono',
      text: 'Do my bidding!'
    };
    var req = new stubs.request('/classes/messages', 'POST', stubMsg);
    var res = new stubs.response();

    requestHandler(req, res);

    expect(res._responseCode).to.equal(201);

    // Now if we request the log for that room the message we posted should be there:
    req = new stubs.request('/classes/messages', 'GET');
    res = new stubs.response();

    requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    var messages = JSON.parse(res._data);
    expect(messages.length).to.be.above(0);
    expect(messages[0].username).to.equal('Jono');
    expect(messages[0].text).to.equal('Do my bidding!');
    expect(typeof messages[0].id).to.equal('number');
    expect(res._ended).to.equal(true);
  });

  it('Server Should 404 when asked for a nonexistent file', function() {
    var req = new stubs.request('/arglebargle', 'GET');
    var res = new stubs.response();

    requestHandler(req, res);

    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });

  it('Server Should 404 when DELETE requests for /classes/message', function() {
    var req = new stubs.request('/classes/messages', 'DELETE');
    var res = new stubs.response();

    requestHandler(req, res);

    expect(res._responseCode).to.equal(404);
    expect(res._ended).to.equal(true);
  });

  it('Server Should answer OPTIONS requests for /classes/messages with a 200 status code', function() {
    var req = new stubs.request('/classes/messages', 'OPTIONS');
    var res = new stubs.response();
    console.log('reqres', req, res);
    requestHandler(req, res);

    expect(res._responseCode).to.equal(200);
    console.log('res._ended', res._ended);
    expect(res._ended).to.equal(true);
  });

});
