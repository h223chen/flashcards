"use strict";
var app = angular.module('app', []);

app.controller('mainCtrl', [
	'$scope',
	'$http',
	function($scope, $http) {
		console.log("HELLO");
		$scope.questions = [];
		$scope.answers = [];
		$scope.selection = [];
		$scope.count = 10;

		var randomizer = function(low, high){
			return Math.trunc((Math.random()*(high-low))+low);
		}

		$scope.submit = function() {
			console.log($scope.answers);

			$http.post('/api/submit', {
					answers: $scope.answers,
					selection: $scope.selection
				})
				.then(function(res) {
					console.log(res);
				});
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
			
			var colTitles = data[0].split('|');

			for (var i=0;i<$scope.count;i++){
				var choices = [];
				var ansType = randomizer(0, data[i].split('|').length - 1); //Determines reference column of description in question
                var choiceType = randomizer(0, data[i].split('|').length - 1); //Determines reference column of choices
                var answerloc = randomizer(0,5); //where answer will be placed in choice
                while (ansType==choiceType) {
                    choiceType = randomizer(0, data[i].split('|').length - 1);
                }				
				for (var j=0; j<5; j++){
					var index = randomizer(1, data.length-1); //index of answer in data
					var ansString = data[index].split('|')[choiceType];
					if (answerloc==j){
						var answerIndex = index;
					}
					while (choices.indexOf(ansString) > -1) {
						index = randomizer(1, data.length-1);
						ansString = data[index].split('|')[choiceType];
					}
					choices[j] = ansString;
				}
			
				var qNum = i+1
				var question = {
					question: "Question " + qNum + ": Which of the following is the " + colTitles[choiceType] + " that matches the following " + colTitles[ansType] + ": " + data[answerIndex].split('|')[ansType] + "?",
					answerChoices: choices 
				};				
				console.log(answerIndex);

				$scope.questions[i] = question;
				$scope.answers[i] = answerloc;
				$scope.selection[i] = null;
			}

			console.log($scope.questions);
			console.log($scope.answers);
		});
	}
]);