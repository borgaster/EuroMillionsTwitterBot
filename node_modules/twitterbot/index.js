var twitter = require('twitter');
const util = require('util');
const EventEmitter = require('events');

var bot = undefined
var self = this
var old = false

var TwitterBot = function (KEY) {
  bot = new twitter(KEY)
  if(KEY['oldCode']) old = true
  EventEmitter.call(this);
  self = this
}
util.inherits(TwitterBot, EventEmitter);
TwitterBot.prototype.createTweet = (text, timeout, callback) => {
  var lastError = undefined
  var id = setInterval(() => {
    if(lastError && lastError[0].code === 182) text+=" "
    bot.post('statuses/update', {status: text},  function(error, tweet, response){
      if(error) {
        self.emit('error', error)
        callback(error)
        lastError = error
      }else{
        lastError = undefined
        self.emit('updated', text)
      }
    });
  }, timeout);
  callback(undefined, id)
}g
TwitterBot.prototype.tweet = (text) => {
  bot.post('statuses/update', {status: text},  function(error, tweet, response){
    if(error){
      self.emit('error', error)
    }
    self.emit('updated', text)
  });
}
TwitterBot.prototype.removeTweet = (id) => {
  clearInterval(id)
}
TwitterBot.prototype.recive = (text, id) => {
  var opt;
  if(follow){
    opt = {track: text, follow: id}
  }else{
    opt = {track: text}
  }
  bot.stream('statuses/filter', opt, (stream) => {
    stream.on('data', (tweet) => {
      self.emit('recived', tweet, opt.track)
      if(old) self.emit('data', tweet, opt.track)
    });
    stream.on('error', (error) => {
      self.emit('error', error)
    });
  });
}
TwitterBot.prototype.media.createTweet = (data, text, timeout, callback) => {
  client.post('media/upload', {media: data}, function(error, media, response){
    if (!error) {

      // Lets tweet it
      var status = {
        status: text,
        media_ids: media.media_id_string // Pass the media id string
      }

      var lastError = undefined
      var id = setInterval(() => {
      if(lastError && lastError[0].code === 182) text+=" "
      bot.post('statuses/update', status,  function(error, tweet, response){
        if(error) {
          self.emit('error', error)
          callback(error)
          lastError = error
        }else{
          lastError = undefined
          self.emit('updated', text)
        }
      });
    }, timeout);
    callback(undefined, id)
  }
  });
}
TwitterBot.prototype.media.tweet = (data, text) => {
  client.post('media/upload', {media: data}, function(error, media, response){
    if (!error) {
      // Lets tweet it
      var status = {
        status: text,
        media_ids: media.media_id_string // Pass the media id string
      }

      client.post('statuses/update', status, function(error, tweet, response){
        if(error) self.emit('error', error)
        else self.emit('updated', text)
      });

    }
  });
}

module.exports = TwitterBot
