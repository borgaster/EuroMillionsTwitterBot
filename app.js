var TwitterPackage = require('twitter');
var Milight = require('node-milight-promise').MilightController;
var commands = require('node-milight-promise').commands2;

var light = new Milight({
        ip: "192.168.1.255",
        delayBetweenCommands: 80,
        commandRepeat: 2
    }),
    zone = 1;

var secret = {
    consumer_key: '6OS4nGfIHNzPzP8qtec2xV1JU',
    consumer_secret: 't9oC9q1KTtjFTldD2xp4Vlrdk23TINMRq5XHGqgdEzqmV34e1s',
    access_token_key: '73137353-wvcjjgiPWMcnH9qj9xz9ChOx7pW6DR2UpLWsZtx3F',
    access_token_secret: 'bwdNWiDZYRvnB7cyx7QYPkifqqa8pJ1vXhQthMy14b8kl'
}
var Twitter = new TwitterPackage(secret);

Twitter.stream('statuses/filter', { track: '#MyAwesomeTwitterBot' }, function(stream) {
    stream.on('data', function(tweet) {
        console.log(tweet.text);
        light.sendCommands(commands.rgbw.on(zone), commands.rgbw.whiteMode(zone), commands.rgbw.brightness(100));
        light.pause(1000);

        light.sendCommands(commands.rgbw.off(zone));
        light.pause(1000);
        let reply = {
            text: "Hi @" + tweet.user.name + ", you just flicked a light in someone's home!",
            screen_name: tweet.user.screen_name
        }
        Twitter.post('direct_messages/new', reply, function(error, tweetReply, response) {
            //if we get an error print it out
            if (error) {
                console.log(error);
            }
            //print the text of the tweet we sent out
            console.log(tweetReply.text);
        });
    });

    stream.on('error', function(error) {
        console.log(error);
    });
});