var Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    Connection = require('mongodb').Connection;

var config = { mongo: { host: "localhost", port: 27017, user: "app_178", db: "app_178" } };
var db = new Db(config.mongo.db, new Server(config.mongo.host, config.mongo.port, {}), {});

db.open(function (err, db) {
    if (!err) {
        //db.authenticate(config.mongo.user, "1234qwer", function (err, res) {
        //    if (err)
        //        console.log(err);
        //});
    } else {
        console.log(err);
    };
});

exports.remove = function (collection, query, callback) {
    query = typeof query === 'string'? JSON.parse(query) : query;
    db.collection(collection).remove(query, callback);
};

exports.insert = function (collection, document) {
    document = typeof document === 'string'? JSON.parse(document) : document;
    db.collection(collection).insert(document, function (err, result) {
        return (err === null) ? { msg: '' } : { msg: err };
    });
};

exports.update = function (collection, criteria, document, options) {
    document = typeof document === 'string'? JSON.parse(document) : document;
    db.collection(collection).update(criteria, document, options, function (err, result) {
        return (err === null) ? { msg: '' } : { msg: err };
    });
};

exports.save = function (collection, document) {
    document = typeof document === 'string'? JSON.parse(document) : document;
    db.collection(collection).save(document, function (err, result) {
        return (err === null) ? { msg: '' } : { msg: err };
    });
};

exports.find = function (collection, query, callback) {
    query = typeof query === 'string'? JSON.parse(query) : query;
    db.collection(collection).find(query).toArray(callback);
};
