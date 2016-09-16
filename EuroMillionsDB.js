		/****************************************************************************/
		/*	Database connector														*/
		/****************************************************************************/

let MongoClient = require('mongodb').MongoClient, assert = require('assert');
 

/*Factory function to generate a connector to interact with the database*/
let EuroMillionsDB = function(url, collection){
	let obj = Object.create(EuroMillionsDB.proto);
	obj.url = url;
	obj.collection = collection;
	return obj;
};
/*Database connector implementation*/
EuroMillionsDB.proto = {
	getUrl: function(){
		return this.url;
	},
	getCollection: function(){
		return this.collection;
	},
	/*insert a record*/
	insert: function(data){
		let url = this.url;
		let collection = this.collection;
		return new Promise((fulfill, reject) => {
			MongoClient.connect(url, (err, db) => {
				console.log("Connected correctly to server");
				if(err){
					reject(err);
				}
				else{
					db.collection(collection).insert(data, (err, result) => {
						if(err){
							reject(err);
						}
						else{
							fulfill(result);
							db.close();
						}
					});
				}
			});
		});
	},
	/*Update euromillions key for a given username. Creates new record if not present*/
	update: function(data, username){
		let url = this.url;
		let collection = this.collection;
		return new Promise((fulfill, reject) => {
			MongoClient.connect(url, (err, db) => {
				console.log("Connected correctly to server");
				if(err){
					reject(err);
				}
				else{
					db.collection(collection).update({'user': username}, data,
						{upsert: true}, (err, result) => {
						if(err){
							reject(err);
						}
						else{
							fulfill(result);
							db.close();
						}
					});
				}
			});
		});
	},
	/*Query records*/
	getRecords: function(data) {
		let url = this.url;
		let collection = this.collection;
		return new Promise((fulfill, reject) => {
			MongoClient.connect(url, (err, db) => {
				console.log("Connected correctly to server");
				if(err){
					reject(err);
				}
				else{
					db.collection(collection).find(data).toArray((err, docs) => {
						if(err){
							reject(err);
						}
						else{
							fulfill(docs);
							db.close();
						}
					});
				}
			});
		});

	}
};
module.exports = EuroMillionsDB;



