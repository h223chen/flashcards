"use strict";
var app = angular.module('app', []);

app.controller('mainCtrl', [
	'$scope',
	'$http',
	function($scope, $http) {
		console.log("HELLO");
		$scope.questions = [];
		$scope.answers = [];
		$scope.answersList = [];
		$scope.selection = [];
		$scope.count = 10;
		$scope.submitClicked = false;
		
		var COLUMN_DELIMITER = '|';
		var EXTRA_DELIMITER = '?';

		var randomizer = function(low, high){
			return Math.trunc((Math.random()*(high-low))+low);
		}

		var generateQuestionString = function(index, answerType, questionType, questionTerm) {
			return "Question " + index + ": Which of the following is the " + answerType + " that matches the following " + questionType + ": " + questionTerm + "?";
		}

		$scope.submit = function() {
			$scope.submitClicked = true;

			$http.post('/api/submit', {
					answers: $scope.answers,
					selection: $scope.selection
				})
				.then(function(res) {
					$scope.correct = res.data.results;
				});
		}
		
		var init = function(data) {
			var columnTitles = data[0].split(COLUMN_DELIMITER);
			for (var i=1; i<=$scope.count; i++) { // Generate questions
				var choices = [];
				
				var numColumns = data[i].split(COLUMN_DELIMITER).length; // number of columns in document
				var questionType = randomizer(0, numColumns); //Determines reference column of description in question
                var choiceType = randomizer(0, numColumns); //Determines reference column of choices                
                var answerIndex = randomizer(0,5); //where answer will be placed in choices
                
                while (questionType === choiceType) { //make sure answers and choices are not of same type
                    choiceType = randomizer(0, numColumns);
                }

                // Select answer
                var questionIndex = randomizer(1, data.length-1); // index of which quality to question
                var line = data[questionIndex].split(COLUMN_DELIMITER);
                var answerString = "";
                
                
				if (questionType == 0) {
					var drugNames = line[choiceType].split(EXTRA_DELIMITER);
					var selectedName = randomizer(0, drugNames.length-1);
					answerString = drugNames[selectedName];
				} else {
					answerString = line[choiceType];
				}


				// Generate choices
				choices[answerIndex] = answerString; //enter correct answer in proper location
				for (var j=0; j<5; j++) { //loop to get the 4 other answer choices
					var choice = "";
					if (answerIndex==j) { //skips this index already containing the answer
						continue;
					}

					do {
						var index = randomizer(1, data.length-1);
						choice = data[index].split(COLUMN_DELIMITER)[choiceType];
						
						if (choiceType == 0) {
							var drugNames = choice.split(EXTRA_DELIMITER);
							$scope.answersList[i-1] = drugNames;
						} else {
							$scope.answersList[i-1] = [choice];
						}
					} while (choices.indexOf(choice) > -1);
					
					var subChoice = "";
					do {
						subChoice = ($scope.answersList[i-1].length > 1) 
								  ? $scope.answersList[i-1][randomizer(0, $scope.answersList[i-1].length)]
								  : $scope.answersList[i-1][0];						
					} while (choices.indexOf(subChoice) > -1);
					
					choices[j] = subChoice;
					
				}
			
				var question = {
					question: questionType == 0 
						? generateQuestionString(i, columnTitles[choiceType], columnTitles[questionType], data[questionIndex].split(COLUMN_DELIMITER)[questionType].split(EXTRA_DELIMITER)[selectedName])
						: generateQuestionString(i, columnTitles[choiceType], columnTitles[questionType], data[questionIndex].split(COLUMN_DELIMITER)[questionType]),
					answerChoices: choices 
				};

				$scope.questions[i-1] = question;
				$scope.answers[i-1] = answerIndex;
				$scope.selection[i-1] = null;
			}
		}

		$http.get('/api/get/OcularDrugs').then(function(res) {			
			var data = res.data;
			if (data.length <= 0) {
				return;
			}

			init(data);
			console.log($scope.answersList);
		});
	}
]);