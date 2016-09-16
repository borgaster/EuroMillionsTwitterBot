let request = require('request');
let EuroMillionsDB = require('./EuroMillionsDB.js');

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
    console.log(' Body :', body);

});