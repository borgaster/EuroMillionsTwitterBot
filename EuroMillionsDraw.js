let request = require('request');
let TwitterPackage = require('twitter');
let EuroMillionsDB = require('./EuroMillionsDB.js');
let secret = require('./TwitterApiKeys.js');
let Twitter = new TwitterPackage(secret);
let connector = EuroMillionsDB('mongodb://localhost:27017/EuroMillionsDraw', 'EuroMillions');

let options = {
    method: 'get',
    url: 'https://euromillions.p.mashape.com/ResultsService/FindLast',
    json: true, // Use,If you are sending JSON data
    headers: {
        // Specify headers, If any
        'X-Mashape-Key': 'IVaS9kmtSimshTpovHj6wXeTbyfAp1OeXCBjsngxP7bPEMnUPI'
    }
};

request(options, function(err, res, body) {
    if (err) {
        console.log('Error :', err);
        return;
    }
    //TODO: Add date of draw to message. Try to improve this replace mess...
    //let myDate = new Date(parseInt(body.Date.replace(/\//g, "").replace(/Date/g, "").replace(/[{()}]/g, ""), 10));
    let key = {
        numbers: [parseInt(body.Num1, 10), parseInt(body.Num2, 10),
            parseInt(body.Num3, 10), parseInt(body.Num4, 10), parseInt(body.Num5, 10)
        ],
        stars: [parseInt(body.Star1, 10), parseInt(body.Star2, 10)]
    };
    connector.getRecords({ checked: false }).then((data) => {
        data.forEach((dataElem) => {
            let correctNumbers = key.numbers.filter((number) => {
                return dataElem.key.numbers.indexOf(number) != -1;
            });
            let correctStars = key.stars.filter((number) => {
                return dataElem.key.stars.indexOf(number) != -1;
            });
            let reply = {
                text: "Hi " + dataElem.user +
                    ", the winner combination for this draw is: Numbers - " +
                    key.numbers.toString() +
                    " Stars -  " + key.stars.toString()+". You got "+
                    correctNumbers.length+" numbers and "+ correctStars.length+" stars correct",
                screen_name: dataElem.user
            };
            console.log(reply);
            Twitter.post('direct_messages/new', reply, function(error, tweetReply, response) {
                //if we get an error print it out
                if (error) {
                    console.log(error);
                }
                //print the text of the tweet we sent out
                console.log(tweetReply.text);
            });
            //Do not check the same record again.
            dataElem.checked = true;
            connector.update(dataElem, dataElem.user);
        });

    }, (err) => {
        console.log(err);
    });
});