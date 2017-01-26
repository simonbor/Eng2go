var http = require('http');
var server = http.createServer(function(req, res) {
    res.writeHead(200, { 'Content-Type': 'text/plain' });

    //var config = JSON.parse(process.env.APP_CONFIG);
    var config = { mongo: { host: "localhost", port: 27017, user: "app_178", db: "app_178" }};
    var MongoClient = require('mongodb').MongoClient;
	//var url = 'mongodb://localhost:27017/myproject';
	var url = "mongodb://" + config.mongo.user + ":1234qwer@" + config.mongo.host + ":" + config.mongo.port + "/" + config.mongo.db;

    MongoClient.connect(    	
		url,
    	function(err, db) {
            if(!err) {
				  insertDocuments(db, function() {
					db.close();
				  });
				res.end("We are connected to MongoDB\n");
            } else {
                res.end("Error while connecting to MongoDB\n");
            }
    });
	
	var insertDocuments = function(db, callback) {
	  // Get the documents collection
	  var collection = db.collection('documents');
	  // Insert some documents
	  collection.insert([
		{a : 1}, {a : 2}, {a : 3}
	  ], function(err, result) {
		console.log("Inserted 3 documents into the document collection");
		callback(result);
	  });
	}

});
server.listen(3000);