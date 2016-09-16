let EuroMillions = {
    generateKey: function() {
        let key = {
            numbers: Array.apply(0, { length: 5 })
                .map(function(elem) {
                    return Math.floor(Math.random() * 50) + 1;
                }),
            stars: Array.apply(0, { length: 2 })
                .map(function(elem) {
                    return Math.floor(Math.random() * 11) + 1;
                })
        };
        return key;
    }
};

module.exports = EuroMillions;