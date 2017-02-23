"use strict";
var app = angular.module('app', []);

app.controller('mainCtrl', [
	'$scope',
	'$http',
	function($scope, $http) {
		console.log("HELLO");
		$scope.questions = [];
		$scope.answers = [];
		$scope.count = 10;

		$http.get('/api/get/WinterDrugs').then(function(res) {
			console.log(res);
			var data = res.data;
			if (data.length <= 0) {
				return;
			}

			var firstLine = data[0].split(',');
			var numColumns = firstLine.length;
			
			for (var i=1; i< data.length; i++) {
				var line = data[i].split(',');

				console.log(line);
			}
			var answer = randomizer(1,data.length); //index of answer in data
			console.log(answer);
			var choices = [];
			var answerloc = randomizer(0,5); //where answer will be placed in choices
			console.log(answerloc);

			for (var i=0; i<5; i++){
				if (i==answerloc){
					choices[i]=answer;
				}
				else{
					choices[i]=randomizer(1,data.length);
				}
			}
			console.log(choices);
			for (var i=0;i<$scope.count;i++){
				$scope.questions.push({
    				"question": "string here",
    				"answerChoices": choices
				});
				$scope.answers[i] = answer;
			}
		});

		var randomizer = function(low, high){
			return Math.trunc((Math.random()*(high-low))+low);
		}

		var checkAns = function(submittedAns){
			var score = [];
			for (var i=0;i<selections;i++){
				if (input[i]==answers[i]){
					score[i]=true;
				}
				else{
					score[i]=false;
				}
			}
			return score;
		}
	}
]);