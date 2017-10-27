'use strict';

let WebSocket = require('ws');
let SServer = WebSocket.Server;

let arrayToStream = require('./transformers/arrayToStream.js');
let timeTransformer = require('./transformers/time.js');
let sentimentTransformer = require('./transformers/sentiment.js');
let accumulator = require('./transformers/accumulator.js');

module.exports = server => {

	// Create the local socket server, which communicates
	// with web clients.
	//
	let localSS = new SServer({
		server: server
	});

	// Bind the local socket server, which communicates
	// with web clients.
	//
	localSS.on('connection', ws => {
	
		let keepalive;

		console.log(process.env)
		
		// A remote SMS gateway
		//
		let switchboard = new WebSocket(process.env.SWITCHBOARD_URL);
	
		switchboard.onopen = () => {
		
			console.log("You have connected to the switchboard.");
			
			// This is necessary for some hosts, which will terminate
			// idle socket connections. Just ping to keep alive (20sec).
			//
			(function $ping() {
				switchboard.ping();
				keepalive = setTimeout($ping, 20000);
			})();
		};
		
		switchboard.on('pong', () => {
			console.log('got pong');
			// Do something re: switchboard unavailability if pong
			// not received after x seconds...
			//
		});
		
		switchboard.onmessage = event => {
	
			let data = event.data;
	
			try {
				data = JSON.parse(data);
			} catch(e) {
				return console.log('Unable to process data: ', data);
			}
			
			if(data.type === 'alert') {
				return console.log(data.text);
			}
	
			if(data.type === 'update') {

				console.log("got update:", data);

				// Transform messages into expected format for UI.
				// Note that we reverse (latest first).
				//
				arrayToStream(data.list.reverse())
				.pipe(timeTransformer({
					format: "%s ago"
				}))
				.pipe(sentimentTransformer('message'))
				.pipe(accumulator((err, messages) => {
					if(err) {
						// Hmm....
						//
						return console.log(err);
					}
					ws.sendMessage({
						messages: messages,
						phone: messages[0].phoneNumber
					})
				}));
			}
		};

		// Need to configure handlers so we can bidirectionally
		// communicate with client UI (snd/rcv messages)
		//
		ws.sendMessage = obj => {

			console.log("TRYING TO SEND:", obj);

			ws.send(JSON.stringify(obj));
		};

		ws.on('message', payload => {

			try {
				payload = JSON.parse(payload);
			} catch(e) {
				return;
			}

			switch(payload.command) {

				case 'available':
				break;

				case 'response':
					switchboard.send(JSON.stringify({
						type: 'response',
						message : payload.message
					}));
				break;

				default:
					// do nothing
				break;
			}
		});

		// When UI client disconnects need to close switchboard connection
		// and the keepalive ping
		//
		ws.on('close', () => {
			clearTimeout(keepalive);
			switchboard.close();
			switchboard = null;
		});
	});
	
	console.log('Client socket server is ready.');
};