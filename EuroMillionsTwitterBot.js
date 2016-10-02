let TwitterPackage = require("twitter");
let EuroMillionsKey = require("./EuroMillions.js");
let EuroMillionsDB = require("./EuroMillionsDB.js");
let secret = require("./TwitterApiKeys.js");
let EuroMillionsDraw = require("./EuroMillionsDraw.js");
let schedule = require("node-schedule");
let Twitter = new TwitterPackage(secret);
let connector = EuroMillionsDB(process.env.MONGODB_URI, "EuroMillions");

let rule = new schedule.RecurrenceRule();
rule.minute = new schedule.Range(0, 59, 1);
schedule.scheduleJob(rule, function(){
     EuroMillionsDraw.fetchResults().then((result) => {
        console.log("resolved");
        console.log(result);
    }, (err) => {
        console.log("error");
        console.log(err);
    });
});
Twitter.stream("statuses/filter", { track: "#MakeMeRichEuromillions" }, function(stream) {
    stream.on("data", function(tweet) {
        console.log(tweet.text);
        let key = EuroMillionsKey.generateKey();
        let record = {
            user: "@" + tweet.user.screen_name,
            key: key,
            checked: false
        };
        let reply = {
            text: "Hi " + tweet.user.name +
                ", your euro millions key is: " +
                key.numbers.toString() +
                " and your stars are: " + key.stars.toString(),
            screen_name: tweet.user.screen_name
        };
        connector.update(record).
        then(() => {
            console.log(tweet.user.screen_name + " got a chance to be filthy rich!");
        }, (err) => {
            console.log(err);
        });
        Twitter.post("direct_messages/new", reply, function(error, tweetReply) {
            //if we get an error print it out
            if (error) {
                console.log(error);
            }
            //print the text of the tweet we sent out
            console.log(tweetReply.text);
        });
    });

    stream.on("error", function(error) {
        console.log(error);
    });
});

