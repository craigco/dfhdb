
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var DFHProvider = require('./dfhprovider').DFHProvider;

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var mongoUri = process.env.MONGOLAB_URI ||
               process.env.MONGOHQ_URL ||
  	       'mongodb://localhost/mydb';


var dfhProvider = new DFHProvider(mongoUri, 27017);

app.get('/', function(req, res){
  dfhProvider.findAll(function(error, helps){
      res.render('index', {
            title: 'Helpers',
            helpers:helps
        });
  });
});

app.get('/dfh/new', function(req, res) {
    res.render('dfh_new', {
        title: 'New Helper'
    });
});

//save new dfh 
app.post('/dfh/new', function(req, res){
    dfhProvider.save({
        name: req.param('name')
    }, function( error, docs) {
        res.redirect('/')
    });
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
