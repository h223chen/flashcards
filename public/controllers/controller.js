"use strict";
var app = angular.module('app', []);

app.controller('mainCtrl', [
	'$scope',
	'$http',
	function($scope, $http) {
		console.log("HELLO");
				
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
		});
	}
]);