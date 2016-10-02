Array.prototype.shuffle = function() {
  var i = this.length, j, temp;
  if ( i === 0 ) return this;
  while ( --i ) {
     j = Math.floor( Math.random() * ( i + 1 ) );
     temp = this[i];
     this[i] = this[j];
     this[j] = temp;
  }
  return this;
};

let EuroMillions = {
    generateKey() {
        let key = {
            numbers: Array.from({length: 50}, (v, k) => k + 1).shuffle().slice(0, 5),
            stars: Array.from({length: 12}, (v, k) => k + 1).shuffle().slice(0, 2)
        };
        return key;
    }
};

module.exports = EuroMillions;