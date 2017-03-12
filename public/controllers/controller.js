"use strict";
var app = angular.module('app', ['underscore']);

app.controller('mainCtrl', [
	'$scope',
	'$http',
	'_',
	function($scope, $http, _) {
		console.log("HELLO");
		console.log(_.VERSION);
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
//		
//		var generateQuestionChoice = function(columnIndex, line) {
//			var choiceString = "";
//			
//			if (columnIndex == 0) {
//				var subChoices = line[columnIndex].split(EXTRA_DELIMITER);
//				var subChoiceIndex = randomizer(0, subChoices.length-1);
//				choiceString = subChoices[subChoiceIndex]
//			} else {
//				choiceString = line[columnIndex];
//			}
//			return choiceString;
//		}

		$scope.submit = function() {
			$scope.submitClicked = true;
			var payload = {
				answers: $scope.answersList,
				selection: $scope.selection
			}
			
			$http.post('/api/submit', payload)
				.then(function(res) {
					$scope.correct = res.data.results;
				});
		}
		
		var init = function(data) {
			var columnTitles = data[0].split(COLUMN_DELIMITER);
			for (var i=1; i<=$scope.count; i++) { // Generate questions
				var choices = [];
				
				var numColumns = data[i].split(COLUMN_DELIMITER).length; // number of columns in document
				var questionType = 0;
				//var choiceType = 0;
				//var questionType = randomizer(0, numColumns); //Determines reference column of description in question
                var choiceType = randomizer(0, numColumns); //Determines reference column of choices                
                var answerIndex = randomizer(0,5); //where answer will be placed in choices
                
                while (questionType === choiceType) { //make sure answers and choices are not of same type
                    choiceType = randomizer(0, numColumns);
                }

                // Select answer
                var questionIndex = randomizer(1, data.length-1); // index of which quality to question
                var line = data[questionIndex].split(COLUMN_DELIMITER);
                var answerString = "";
                
                // Generate answer string
				if (choiceType == 0) {
					var subQuestions = line[choiceType].split(EXTRA_DELIMITER);
					var subQuestionIndex = randomizer(0, subQuestions.length-1);
					answerString = subQuestions[subQuestionIndex];
					$scope.answersList[i-1] = subQuestions;
				} else {
					answerString = line[choiceType];
					$scope.answersList[i-1] = [answerString];
				}


				// Generate choices
				choices[answerIndex] = answerString; //enter correct answer in proper location
				for (var j=0; j<5; j++) { //loop to get the 4 other answer choices					
					if (answerIndex==j) { //skips this index already containing the answer
						continue;
					}
					
					var choice = "";

					do {
						var index = randomizer(1, data.length-1);
						choice = data[index].split(COLUMN_DELIMITER)[choiceType];
						var subChoice = "";
						if (choiceType == 0) {
							var subChoices = choice.split(EXTRA_DELIMITER);
							
							if (_.contains(choices, choice) || _.difference(subChoices, choices) == 0) { continue; }
							var count = 0;
							do {										
								subChoice = (subChoices.length > 1)
										  ? subChoices[randomizer(0, subChoices.length)]
										  : choice;						
							} while (choices.indexOf(subChoice) > -1);
						} else {
							subChoice = choice;
						} 
					} while (choices.indexOf(choice) > -1);
					
										
					choices[j] = subChoice;
					
				}
			
				//selects drug name in list for question
				var questionDrugs = data[questionIndex].split(COLUMN_DELIMITER)[questionType].split(EXTRA_DELIMITER);
				var druginQuestion = questionDrugs[randomizer(0, questionDrugs.length-1)];
				var question = {
					question: questionType == 0 
						? generateQuestionString(i, columnTitles[choiceType], columnTitles[questionType], druginQuestion)
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