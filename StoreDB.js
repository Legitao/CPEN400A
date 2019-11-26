var MongoClient = require('mongodb').MongoClient;	// require the mongodb driver

/**
 * Uses mongodb v3.1.9 - [API Documentation](http://mongodb.github.io/node-mongodb-native/3.1/api/)
 * StoreDB wraps a mongoDB connection to provide a higher-level abstraction layer
 * for manipulating the objects in our bookstore app.
 */
function StoreDB(mongoUrl, dbName){
	if (!(this instanceof StoreDB)) return new StoreDB(mongoUrl, dbName);
	this.connected = new Promise(function(resolve, reject){
		MongoClient.connect(
			mongoUrl,
			{
				useNewUrlParser: true
			},
			function(err, client){
				if (err) reject(err);
				else {
					console.log('[MongoClient] Connected to '+mongoUrl+'/'+dbName);
					resolve(client.db(dbName)); //client is a MongoClient object or Db object?
					//https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html
				}
			}
		)
	});
}

StoreDB.prototype.getProducts = function(queryParams){
	console.log(queryParams);
	var query = { $and: [] };
	if (queryParams.hasOwnProperty("minPrice")) {
		query.$and.push({ "price": { $gte: parseInt(queryParams.minPrice, 10) } });
	}
	if (queryParams.hasOwnProperty("maxPrice")) {
		query.$and.push({ "price": { $lte: parseInt(queryParams.maxPrice, 10) } });
	}
	if (queryParams.hasOwnProperty("category")) {
		query.$and.push({ "category": queryParams.category });
	}
	return this.connected.then(function (db) {
		return new Promise(function (resolve, reject) {
			var products = {};
			db.collection("products").find(query.$and.length > 0 ? query : {}).toArray(function (err, result) {
				if (err) {
					console.log("Product promise rejected: " + err);
					reject(err);
				} else {
					for (var i = 0; i < result.length; i++) {
						var key = result[i]._id;
						products[key] = {
							label: result[i].label,
							price: result[i].price,
							quantity: result[i].quantity,
							imageUrl: result[i].imageUrl
						}
					}
					resolve(products);
				}
			});
		})
	})
}

StoreDB.prototype.addOrder = function (order) {
	return this.connected.then(function (db) {
		return new Promise(function (resolve, reject) {
			//Normally, since we have done order validity checking in index.js before calling addOrder, we don't need to write duplicate checking here
			//But in test-5.js line 202, it calls store.addOrder() directly, so I have to write the checking code here
			var validOrder = order.hasOwnProperty("client_id") && typeof order.client_id == "string" &&
					order.hasOwnProperty("cart") && typeof order.cart == "object" &&
					order.hasOwnProperty("total") && typeof order.total == "number";
			if (!validOrder) {
				var errMsg = "Order object is invalid";
				reject(new Error(errMsg));
			}
			else {
				db.collection("orders").insertOne(order).then(function (result) {
					console.log("Order promise succesful: ");
					var itemCount = Object.keys(order.cart).length;
					console.log(itemCount);
					for (var productName in order.cart) {
						var quantity = order.cart[productName];
						db.collection("products").updateOne({ "_id": productName }, { $inc: { "quantity": -quantity } })
						.then(ack => {
							itemCount--;
							if (itemCount == 0) {
								// all item quantities have been decremented, so resolve
								resolve(result.insertedId);
							}
						}, err => {
							console.log("Could not decrement quantity for " + productName + " : " + err);
							reject(error);
						});
					}
				}, error => {
					console.log("Order promise rejected: " + err);
					reject(error);
				});
			}
		})
	})
}

module.exports = StoreDB;