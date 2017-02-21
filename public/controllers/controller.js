"use strict";
var app = angular.module('app', []);

app.controller('mainCtrl', [
	'$scope',
	'$http',
	function($scope, $http) {
		console.log("HELLO");
		
		
		$http.get('/api/get/WinterDrugs', function(req, res) {
			if (res.length <= 0) {
				return;
			}

			var firstLine = res[0].split(',');
			var numColumns = firstLine.length;
			
			for (var i=1; i< res.length; i++) {
				var line = res[i].split(',');
				
				
			}
		});
	}
]);