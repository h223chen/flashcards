"use strict";
/**
 * Imports
 */
var express = require('express');
var bodyParser = require('body-parser');
var f = require('./global_functions.js');
var fs = require('fs')
var app = express();

/**
 * Constants declaration
 */
var SOURCE_FOLDER = 'source_files/';
var REFRESH_URL = '/refresh';

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json());

var sourceFiles = {};
var init = function() {
	fs.readdir(SOURCE_FOLDER, function(err, files) {
		if (err) {
			f.error(err);
			return err;
		}
		
		for (var i in files) {
			var file = files[i];
			// read only csv files			
			if (file.indexOf('.csv')) {
				(function(path, file) {
					fs.readFile(path + file, 'utf8', function(err, data) {
						var lines = [];
						if (err) {
							f.error(err);
							return err;
						}						

						lines = data.split('\n');
						sourceFiles[file] = lines;
						if (lines.length > 0) {
							f.info("imported " + lines.length + " lines from " + file + " successfully");
						} else {
							f.warn("file " + file + " imported but 0 lines were read");
						}
					});					
				})(SOURCE_FOLDER, file);
				
			}
		}
	});	
};

init();

var checkAnswers = function(selection, answers) {
	if (selection == null) { return false; }
	
	for (var i=0; i<answers.length; i++) {
		f.info("selection " + i + ": " + selection.trim())
		f.info("answers " + i + ": " + answers[i].trim());
		if (selection.trim() === answers[i].trim()) {
			return true;
		}
	}
	
	return false;
}

app.post('/api/submit', function(req, res) {
	var body = req.body;
	var query = req.query;

	//write comparison here
	var results = [];
	for (var i=0; i<req.body.answers.length; i++) {
		var selection = req.body.selection[i];
		var answerList = req.body.answers[i];		
		results[i] = checkAnswers(selection, answerList);	
	}

	console.log(results);
	res.json({results: results});
})

app.get('/api/get/:name', function(req, res) {
	var name = req.params.name;
	// f.info(sourceFiles[name + ".csv"]);
	res.send(sourceFiles[name + ".csv"]);
});

app.get(REFRESH_URL, function(req, res) {
	init();
});

app.get('/', function(req, res) {
	res.send('Hello World');
})

var server = app.listen(8081, "127.0.0.1", function() {
	var host = server.address().address
	var port = server.address().port

	console.log("Server listening at http://%s:%s", host, port)
})