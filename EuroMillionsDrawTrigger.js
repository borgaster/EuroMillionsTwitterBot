let EuroMillionsDraw = require("./EuroMillionsDraw.js");
let schedule = require("node-schedule");

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