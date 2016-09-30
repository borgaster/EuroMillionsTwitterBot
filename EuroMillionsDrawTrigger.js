let EuroMillionsDraw = require("./EuroMillionsDraw.js");

EuroMillionsDraw.fetchResults().then((result) => {
    console.log("resolved");
    console.log(result);
}, (err) =>{
    console.log("error");
    console.log(err);
});