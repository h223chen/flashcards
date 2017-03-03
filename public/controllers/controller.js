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
		$scope.submitClicked = false;

		var randomizer = function(low, high){
			return Math.trunc((Math.random()*(high-low))+low);
		}

		$scope.submit = function() {
			$scope.submitClicked = true;
			console.log($scope.answers);

			$http.post('/api/submit', {
					answers: $scope.answers,
					selection: $scope.selection
				})
				.then(function(res) {
					console.log(res.data.results);
					$scope.correct = res.data.results;
				});
		}

		$http.get('/api/get/OcularDrugs').then(function(res) {
			console.log(res);
			var data = res.data;
			if (data.length <= 0) {
				return;
			}

			for (var i=1; i< data.length; i++) {
				var line = data[i].split(',');
			}
			
			var colTitles = data[0].split('|');

			for (var i=0;i<$scope.count;i++){ //Generate questions
				var choices = [];
				var ansType = randomizer(0, data[i].split('|').length - 1); //Determines reference column of description in question
                var choiceType = randomizer(0, data[i].split('|').length - 1); //Determines reference column of choices
                var answerloc = randomizer(0,5); //where answer will be placed in choice
                while (ansType==choiceType) { //make sure answers and choices are not of same type
                    choiceType = randomizer(0, data[i].split('|').length - 1);
                }

                //Select answer
                var index = randomizer(1, data.length-1); //index of answer in data
				if (choiceType==0){
					var DrugNames = data[index].split('|')[choiceType].split('?');
					var selectedName = randomizer(0, DrugNames.length - 1);
					var ansString = DrugNames[selectedName];
				}
				else{
					var ansString = data[index].split('|')[choiceType];
					var selectedName = 0; //In case it is left undefined
				}
				//Keep index information to generate question
				var answerIndex = index; //answer location in csv
				var answerDrugName = selectedName; //answer location in drug name array

				//Generate choices
				for (var j=0; j<5; j++){ //loop to get 5 answer choices
					if (answerloc==j){
						if (choiceType==0){
							ansString = data[answerIndex].split('|')[choiceType].split('?')[answerDrugName];
						}
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