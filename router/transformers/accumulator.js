'use strict';

let es = require('event-stream');

module.exports = cb => es.writeArray(cb);
