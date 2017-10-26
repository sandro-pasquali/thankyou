'use strict';

let readline = require('readline');
let fs = require('fs');

let rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout
});

rl.question('What is the URL of your switchboard?\n', ans => {
	if(ans.trim() !== '') {
		fs.writeFileSync('./config/.config.json', JSON.stringify({
			URL: ans
		}));
	} else {
		console.log("No config written. Answer is blank.");
	}
	rl.close();
});