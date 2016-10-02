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

  //TODO: Do something

  twbot.removeTweet(id) // "Hello, World!" will not tweeted anymore.
  // Tweet has already been created will NOT BE REMOVED.
})
