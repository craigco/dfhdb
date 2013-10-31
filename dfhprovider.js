var mongo = require('mongodb');

var mongoUri = process.env.MONGOLAB_URI ||
  			   process.env.MONGOHQ_URL ||
  			   'mongodb://localhost/mydb';

var Db = require('mongodb').Db;
var Connection = require('mongodb').Connection;
var Server = require('mongodb').Server;
var BSON = require('mongodb').BSON;
var ObjectID = require('mongodb').ObjectID;


DFHProvider = function(host, port) {
  this.db= new Db('node-mongo-dfhdb', new Server(host, port, {safe: false}, {auto_reconnect: true}, {}));
  this.db.open(function(){});
};


DFHProvider.prototype.getCollection= function(callback) {
  this.db.collection('dfhs', function(error, dfh_collection) {
    if( error ) callback(error);
    else callback(null, dfh_collection);
  });
};

//find all dfhs
DFHProvider.prototype.findAll = function(callback) {
    this.getCollection(function(error, dfh_collection) {
      if( error ) callback(error)
      else {
        dfh_collection.find().toArray(function(error, results) {
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};

//save new dfh
DFHProvider.prototype.save = function(dfhs, callback) {
    this.getCollection(function(error, dfh_collection) {
      if( error ) callback(error)
      else {
        if( typeof(dfhs.length)=="undefined")
          dfhs = [dfhs];

        for( var i =0;i< dfhs.length;i++ ) {
          dfh = dfhs[i];
          dfh.created_at = new Date();
        }

        dfh_collection.insert(employees, function() {
          callback(null, dfhs);
        });
      }
    });
};

exports.DFHProvider = DFHProvider;
