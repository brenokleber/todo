"use strict";

(function() {

	angular
	.module("chartForm.directive", [])
	.directive("chartForm", chartForm);
	
	function chartForm() {
		return {
			restrict: 'E',
			replace: true,
			controller: function AppCtrl($scope) {
				$scope.update = function (d, i) {
					$scope.data = randomData();
				};

				function randomData() {
					return d3.range(~~(Math.random() * 50) + 1).map(function (d, i) {
						return ~~(Math.random() * 1000);
					});
				}
			},
			template: '<div class="form">' +
				'Height: {{options.height}}<br />' +
				'<input type="range" ng-model="options.height" min="100" max="800"/>' +
				'<br /><button ng-click="update()">Update Data</button>' +
				'<br />Hovered bar data: {{barValue}}</div>'
		}
	}

})();
