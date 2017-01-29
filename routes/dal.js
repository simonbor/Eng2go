var mongodb = require('mongodb');
var uri = process.env.MONGOLAB_URI;
var db;

mongodb.MongoClient.connect(uri,function(err, dbMongoLab) {
    if (!err) {
        db = dbMongoLab;
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
