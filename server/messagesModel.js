const messages = require('./data/messages.json');

var readAll = function() {
  return new Promise((resolve, reject) => {
    resolve(messages);
  });
};

var create = function(message) {
  return new Promise((resolve, reject) => {
    messages.push(message);
    console.log(messages);
    // if (process.env.NODE_ENV !== 'test') {
    //   writeDataToFile('./data/messagesModel.json', messages);
    // }
    resolve(message);
  });
};

module.exports = {
  readAll,
  create
};