let TwitterPackage = require('twitter');
let EuroMillionsKey = require('./EuroMillions.js');
let EuroMillionsDB = require('./EuroMillionsDB.js');
let secret = require('./TwitterApiKeys.js');

let Twitter = new TwitterPackage(secret);

let connector = EuroMillionsDB('mongodb://localhost:27017/EuroMillionsDraw', 'EuroMillions')

Twitter.stream('statuses/filter', { track: '#MakeMeRichEuromillions' }, function(stream) {
    stream.on('data', function(tweet) {
        console.log(tweet.text);
        let key = EuroMillionsKey.generateKey()
        let record = {
            user: "@" + tweet.user.screen_name,
            key: key
        }
        let reply = {
            text: "Hi " + tweet.user.name +
                ", your euro millions key is: " +
                key.numbers.toString() +
                " and your stars are: " + key.stars.toString(),
            screen_name: tweet.user.screen_name
        }
        connector.update(record, tweet.user.screen_name).
        then((data) => {
            console.log(weet.user.screen_name + " got a chance to be filthy rich!")
        }, (err) => {
            console.log(err)
        });
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