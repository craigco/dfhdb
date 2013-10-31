var MongoClient = require('mongodb').MongoClient;

var mongoUri = process.env.MONGOLAB_URI ||
  			   process.env.MONGOHQ_URL ||
  			   'mongodb://localhost/mydb';

//mongo.Db.connect(mongoUri, function (err, db) {
//  db.collection('mydocs', function(er, collection) {
//    collection.insert({'mykey': 'myvalue'}, {safe: true}, function(er,rs) {
//    });
//  });
//});

DFHProvider = function() {
  MongoClient.connect(mongoUri, function(err, db) {
    this.db = db;	
  });
};


DFHProvider.prototype.getCollection= function(callback) {
  this.db.collection('helpers', function(error, helper_collection) {
    if( error ) callback(error);
    else callback(null, helper_collection);
  });
};

//find all helpers
DFHProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, helper_collection) {
      if( error ) callback(error)
      else {
        helper_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new helper
DFHProvider.prototype.save = function(helpers, callback) {
    this.getCollection(function(error, helper_collection) {
      if( error ) callback(error)
      else {
        if( typeof(helpers.length)=="undefined")
          helpers = [helpers];

        for( var i =0;i< helpers.length;i++ ) {
          helper = helpers[i];
          helper.created_at = new Date();
        }

        helper_collection.insert(helpers, function() {
          callback(null, helpers);
        });
      }
    });
};

exports.DFHProvider = DFHProvider;
