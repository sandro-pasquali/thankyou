'use strict';

let http = require('http');
let session = require('express-session')
let express = require('express');
let bodyParser = require('body-parser');

let defaultPort = 8080;

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(express.static('./public'));
app.use(session({ 
	secret: 'somerandomstring',
	saveUninitialized: false,
	resave: false
})); 

let server = http.createServer(app);
server.listen(process.env.PORT || defaultPort);

console.log('HTTP server listening on', process.env.PORT || defaultPort);

// The client is connected to a local socket server, which sends client->LocalSS->customer messages.
// The local SS is connected to switchboard, receiving SMS->switchboard->LocalSS->client messages.
//
require('./bindSocketServer.js')(server);

