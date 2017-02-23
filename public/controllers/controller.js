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
			}
			
			
			var answerloc = randomizer(0,5); //where answer will be placed in choices

			for (var i=0;i<$scope.count;i++){
				var choices = [];
				var ansType = randomizer(0, data[i].length - 1);
                var choiceType = randomizer(0, data[i].length - 1);
                while (ansType==choiceType) {
                    choiceType = randomizer(0, data[i].length - 1);
                }				
				for (var j=0; j<5; j++){
					var index = randomizer(1, data.length); //index of answer in data

					while (choices.indexOf(index) > -1) {
						index = randomizer(1, data.length);
					}
					choices = data[index].split('|');
				}
			
				var question = {
					question: "string here " + i,
					answerChoices: choices 
				};				
				console.log(question.answerChoices);

				$scope.questions[i] = question;
				$scope.answers[i] = answerloc;
			}

			console.log($scope.questions);
		});
	}
]);