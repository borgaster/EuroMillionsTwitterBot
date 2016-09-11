let chai = require('chai');
chai.should();
chai.use(require('chai-things'));
let expect = chai.expect; // we are using the "expect" style of Chai
let EuroMillionsKey = require('../EuroMillions.js');
let EuroMillionsDB = require('../EuroMillionsDB.js');
let MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

let key = EuroMillionsKey.generateKey();
let url = "mongodb://localhost:27017/EuroMillionsDraw";
let collection = "EuroMillions"
let connector = EuroMillionsDB(url, collection);
let record = {
    user: "@TestUser",
    key: key
}
describe('EuroMillionsDB', () => {
    it('Should generate a connector', () => {
        expect(connector).is.not.undefined
    });
    it('Should get correct URL', () => {
        expect(connector.getUrl()).is.equal("mongodb://localhost:27017/EuroMillionsDraw");
    });
    it('Should get correct collection', ()  => {
        expect(connector.getCollection()).is.equal('EuroMillions');
    });
    it('Should insert a record', (done) => {
        setTimeout(() => {
            connector.insert(record).
            then((data) => {
                MongoClient.connect(url, (err, db) => {
                    if (err) {
                        done(err);
                    } else {
                        db.collection(collection).find(record).toArray((err, docs) => {
                            if (err) {
                                done(err);
                                db.close();
                            } else {
                                expect(docs).is.not.null;
                                done();
                                db.close();
                            }
                        })
                    }
                });

            }, (err) => {
                done(err)
            });

        })

    });
    it("Should update a record", (done) => {
        setTimeout( () => {
            let newKey = EuroMillionsKey.generateKey();
            let newRecord = {
                user: "@TestUser",
                key: key
            }
            connector.update(newRecord, "@TestUser").
            then((data) => {
                if (data.result.nModified === 1) {
                    done()
                } else {
                    done("Error updating");
                }

            }, (err) => {
                done(err)
            });

        });
    });
    it("Should retreive a record", (done) => {
    	setTimeout(() => {
    		connector.getRecords(record).
    		then((data) => {
    			if(data.length > 0){
    				done()
    			}
    			else{
    				done("Tried to retreive but no record found");
    			}
    		}, (err) => {
    			done(err);
    		})
    	})
    })

});