"use strict";

(function() {

	angular
	.module("sol.relatorio.cliente")
	.controller("relatorioCliente", relatorioCliente);

	/* eslint-disable max-len */
	relatorioCliente.$inject = ["$scope", "$http"];

	function relatorioCliente($scope, $http) {
		// $scope.options = {
		// 	width: 500,
		// 	height: 300,
		// 	"bar": "aaa"
		// };
		// $scope.data = [1, 2, 3, 4];
		// $scope.hovered = function (d) {
		// 	$scope.barValue = d;
		// 	$scope.$apply();
		// };
		// $scope.barValue = "None";

		//------------------------------------------------------
		

		$scope.titulo = "Serviço Especial";
		$scope.ss = null;
		$scope.ajax = function(tableState) {
		
			tableState = tableState || {
				"sort": {},
				"search": {},
				"pagination": {
					"start": 0,
					"totalItemCount": 0,
					"number": 5
				}
			};

			var pagination = tableState.pagination;
			var page = pagination.start / 5 || 0;

			var options = {};
			var search  = tableState.search.predicateObject;
			var sort    = tableState.sort;

			if(search) {
				if(Object.keys(search).length > 0) {
					options.search = search;
					if(options.search.localidade) {
						
						var termo = options.search.localidade.cidade;
						options.search.localidade.sigla = termo;
						options.search.estado2 = {
							sigla: termo
						};
					}

					options.search.or = {
						localidade: ["cidade", "sigla"],
						estado2: ["sigla"]
					};
				}
			}

			if(sort) {
				if(Object.keys(sort).length > 0) {
					options.sort = {
						reverse: sort.reverse,
						field:   sort.predicate
					};
				}
			}

			options.page = page + 1;

			var url = "/api/relatorios/cliente?page=" + options.page;

			if(options.search) {
				url += "&search=" + JSON.stringify(options.search);
			}
			if(options.sort) {
				url += "&sort=" + JSON.stringify(options.sort);
			}
			if(options.finalizadas) {
				url += "&finalizadas=" + options.finalizadas;
			}
			if(options.inicio) {
				url += "&inicio=" + options.inicio;
			}
			if(options.final) {
				url += "&final=" + options.final;
			}
			
			$http.get(url).then(function (response){
				$scope.ss                           = response.data.servicos_especiais;
				tableState.pagination.numberOfPages = response.data.pagesNumber;
				$scope.total                        = response.data.total;
			}, function (err){
				console.log(err);
			});
		};
		$scope.ajax();
		$scope.removerColuna = function(elementos,prop){
			elementos.forEach(function (element) {
				delete element[prop];
			});
		};
	}
})();
