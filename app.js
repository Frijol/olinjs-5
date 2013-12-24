
/**
 * Module dependencies.
 */

var express = require('express');
var Facebook = require('facebook-node-sdk');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express.createServer(); //WAS just express()

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(express.bodyParser());
app.use(express.cookieParser('your secret here'));
app.use(express.session({ secret: 'VERY SECRET' }));
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(Facebook.middleware({ appId: 'YOUR_APP_ID', secret: 'YOUR_APP_SECRET' }));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/', Facebook.loginRequired(), function (req, res) {
	req.facebook.api('/me', function(err, user) {
		res.writeHead(200, {'Content-Type': 'text/plain'});
		res.end('Hello, ' + user.name + '!');
	});
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
