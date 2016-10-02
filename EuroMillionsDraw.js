let request = require("request");
let TwitterPackage = require("twitter");
let EuroMillionsDB = require("./EuroMillionsDB.js");
let secret = require("./TwitterApiKeys.js");
let Twitter = new TwitterPackage(secret);
let connector = EuroMillionsDB(process.env.MONGODB_URI, "EuroMillions");

let options = {
    method: "get",
    url: "https://euromillions.p.mashape.com/ResultsService/FindLast",
    json: true, // Use,If you are sending JSON data
    headers: {
        // Specify headers, If any
        "X-Mashape-Key": process.env.MASHAPE_TOKEN_KEY
    }
};

connector.updateChecked = function(data) {
    let url = this.url;
    let collection = this.collection;
    let mongoClient = this.mongoClient;
    return new Promise((fulfill, reject) => {
        mongoClient.connect(url, (err, db) => {
            console.log("Connected correctly to server");
            if (err) {
                reject(err);
            } else {

                db.collection(collection).update({
                    $or: data.map((elem) => {
                        return { user: elem.user };
                    })
                }, { $set: { checked: true } }, { upsert: true, multi: true }, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        fulfill(result);
                    }
                });
            }
            db.close();
        });
    });
};

let EuroMillionsDraw = {
    fetchResults() {
        return new Promise((fulfill, reject) => {
            request(options, (err, res, body) => {
                if (err) {
                    console.log("Error :", err);
                    reject(err);
                    return;
                }
                //TODO: Try to improve this replace mess...
                let options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
                let myDate = new Date(parseInt(body.Date.replace(/\//g, "").replace(/Date/g, "")
                        .replace(/[{()}]/g, ""), 10))
                    .toLocaleDateString("en-GB", options);
                let winnerKey = {
                    numbers: [parseInt(body.Num1, 10), parseInt(body.Num2, 10),
                        parseInt(body.Num3, 10), parseInt(body.Num4, 10), parseInt(body.Num5, 10)
                    ],
                    stars: [parseInt(body.Star1, 10), parseInt(body.Star2, 10)]
                };
                connector.getRecords({ checked: false }).then((data) => {
                    data.forEach((dataElem) => {
                        console.log(dataElem.key.length);
                        dataElem.key.forEach((key) => {
                            console.log(key);
                            let correctNumbers = key.numbers.filter((number) => {
                                return winnerKey.numbers.indexOf(number) !== -1;
                            });
                            let correctStars = key.stars.filter((number) => {
                                return winnerKey.stars.indexOf(number) !== -1;
                            });
                            let reply = {
                                text: "Hi " + dataElem.user +
                                    " the winner combination for " + myDate.toString() + "  is: Numbers - " +
                                    winnerKey.numbers.toString() +
                                    " Stars -  " + winnerKey.stars.toString() + ". You got " +
                                    correctNumbers.length + " numbers and " + correctStars.length + " stars correct",
                                screen_name: dataElem.user
                            };
                            Twitter.post("direct_messages/new", reply, function(error, tweetReply) {
                                //if we get an error print it out
                                if (error) {
                                    console.log(error);
                                    reject(error);
                                }
                                //print the text of the tweet we sent out
                                console.log(tweetReply.text);
                            });

                        });
                        //Do not check the same record again. Set isChecked to true.
                        dataElem.checked = true;
                    });
                    //Update records
                    if (data.length > 0) {
                        connector.updateChecked(data).then(() => {
                            fulfill(data.length + " players entered the draw and got their results");
                        }, (err) => {
                            reject(err);
                        });
                    }
                    else{
                        reject("No players found");
                    }

                }, (err) => {
                    reject(err);
                });
            });
        });
    }
};

module.exports = EuroMillionsDraw;