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
		
		var COLUMN_DELIMITER = '|';
		var EXTRA_DELIMITER = '?';

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
		
		var handleGetResponseData = function(data) {			
			var columnTitles = data[0].split(COLUMN_DELIMITER);
			console.log("data: " + data);
			for (var i=1; i<$scope.count; i++) { // Generate questions
				console.log(i);
				var choices = [];
				
				var numColumns = data[i].split(COLUMN_DELIMITER).length; // number of columns in document
								var questionType = randomizer(0, numColumns); //Determines reference column of description in question
                var choiceType = randomizer(0, numColumns); //Determines reference column of choices                
                var answerIndex = randomizer(0,5); //where answer will be placed in choices
                
                while (questionType === choiceType) { //make sure answers and choices are not of same type
                    choiceType = randomizer(0, numColumns);
                }

                // Select answer
                var questionIndex = randomizer(1, data.length-1); // index of which question to ask
                var line = data[questionIndex].split(COLUMN_DELIMITER);
                var answerString = "";
                
				if (choiceType == 0) {
					var drugNames = line[choiceType].split(EXTRA_DELIMITER);
					var selectedName = randomizer(0, drugNames.length - 1);
					answerString = drugNames[selectedName];
				} else {
					answerString = line[choiceType];
				}
				
				//Keep questionIndex information to generate question
				var answerDrugName = selectedName; //answer location in drug name array

				//Generate choices
				for (var j=0; j<5; j++) { //loop to get 5 answer choices
					var choice = "";
					if (answerIndex==j) { // this choice is the correct answer
						if (choiceType === 0){
							choice = answerString;
						} else {
							choice = line[choiceType];
						}
					} else {
						var index = randomizer(1, data.length-1);
						choice = data[index].split(COLUMN_DELIMITER)[choiceType];
					}
					
					while (choices.indexOf(choice) > -1) {
						console.log("TEST");
						var index = randomizer(1, data.length-1);
						choice = data[index].split(COLUMN_DELIMITER)[choiceType];
					}
					
					choices[j] = choice;
				}
			
				var question = {
					question: "Question " + (i) + ": Which of the following is the " + columnTitles[choiceType] + " that matches the following " + columnTitles[questionType] + ": " + data[answerIndex].split(COLUMN_DELIMITER)[questionType] + "?",
					answerChoices: choices 
				};				
				console.log(answerIndex);

				$scope.questions[i-1] = question;
				$scope.answers[i-1] = answerIndex;
				$scope.selection[i-1] = null;
			}
		}

		$http.get('/api/get/OcularDrugs').then(function(res) {
			console.log(res);
			var data = res.data;
			if (data.length <= 0) {
				return;
			}

			 handleGetResponseData(data);

			console.log($scope.questions);
			console.log($scope.answers);
		});
	}
]);