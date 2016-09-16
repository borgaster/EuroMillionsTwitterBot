# twitterbot
![/](https://nodei.co/npm/twitterbot.png?downloads=true&downloadRank=true&stars=true)

[![npm](https://img.shields.io/npm/dt/twitterbot.svg?style=flat-square)](https://www.npmjs.com/package/twitterbot) [![npm](https://img.shields.io/npm/l/twitterbot.svg?style=flat-square)](https://www.npmjs.com/package/twitterbot)
[![management](https://img.shields.io/badge/management-Atus-blue.svg?style=flat-square)](http://www.atus.ml)
[![label](https://img.shields.io/github/issues-raw/badges/teamatus/twitterbot.svg?style=flat-square)](https://github.com/teamatus/twitterbot)

This is Twitter Warpper for develop your own bot on twitter. on now, this project use timer built-in timer, so **callback time and twitted is not accurate**. 0.5 to 1 second late or may be faster.

## Example
### Tweet "Hello, World!" every 3 second!
```javascript
var TwitterBot = require('twitterbot')
var bot = new TwitterBot({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
}) // Your Keys Here
bot.createTweet("Hello, World!", 3000, (err, id) => {
  if(err) throw err;
  // Register Tweet. This will tweet "Hello, World!" every 3 second!

  doSomething()

  bot.removeTweet(id) // "Hello, World!" will not tweeted anymore.
  // Tweet has already been created will NOT BE REMOVED.
})
```
### Log it tweet contains "nodejs" and steam sale.
```javascript
var TwitterBot = require('twitterbot')
var bot = new TwitterBot({
  consumer_key: '',
  consumer_secret: '',
  access_token_key: '',
  access_token_secret: ''
}) // Your Keys Here
bot.recive("nodejs")
bot.recive("sale", "steam_games")
bot.on('error', (err) => {
  throw err;
})
bot.on('recived', (data, tt) => { // Recived Tweet contains "nodejs".
  if(tt === 'sale') console.log("sorry, steam sale something now.")
  console.log(data.text)
})
```
## Why `twitterbot`
 * No message 'Status is a duplicate.'
  * This will automatically add space to avoid the filter. (experimental)

## API
### bot
#### event
 * recived (tweet, trackedText)
 * error (err)
 * upadted (plainText)

### function
 * createTweet(text, timeout, callback(err, id))
 * removeTweet(id)
 * recive(text, id)
   * You can filter by user id, option.
   * id should not contains @.
 * tweet(text)

### bot.media
#### function
 * createTweet(media, text, timeout, callback(err, id))
  * media can be found at file like `var data require('fs').readFileSync('image.jpg')`;
 * tweet(media, text)
