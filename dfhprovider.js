var mongo = require('mongodb').MongoClient;

var mongoUri = process.env.MONGOLAB_URI ||
  	       process.env.MONGOHQ_URL ||
  	       'mongodb://localhost/helperapp';

var database = null;

DFHProvider = function() {
  mongo.connect(mongoUri, {}, function(error, db) {
    database = db;

    database.addListener("error", function(error){
      console.log("Error connecting to MongoLab");
    });
  });
};


DFHProvider.prototype.getCollection= function(callback) {
  database.collection('usercollection', function(error, helper_collection) {
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
