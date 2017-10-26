'use strict';

// Simply connect to the local socket server
//
let host = window.document.location.host.replace(/:.*/, '');
let ws = new WebSocket('ws://' + host + ':8080');

ws.sendMessage = function(command, msg) {
	this.send(JSON.stringify({
		command : command || '',
		message : msg || ''
	}));
};