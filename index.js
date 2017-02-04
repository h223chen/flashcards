"use strict";
var express = require('express');
var f = require('./global_functions.js');
var fs = require('fs')
var app = express();


var lines = [];
var init = function() {
	fs.readFile('test.csv', 'utf8', function(err, data) {
		if (err) {
			return f.error(err);
		}
		
		lines = data.split('\n');
		if (lines.length > 0) {
			f.info("imported " + lines.length + " lines successfully");
		} else {
			f.warn("file imported but 0 lines were read");
		}
	});
};

init();

app.get('/', function(req, res) {
	res.send('Hello World');
})

var server = app.listen(8081, "127.0.0.1", function() {
	var host = server.address().address
	var port = server.address().port

	console.log("Server listening at http://%s:%s", host, port)
})