"use strict";

(function() {

	angular
	.module("sol.relatorio.cliente")
	.config(config);

	config.$inject = ["$routeProvider","$locationProvider"];

	function config($routeProvider, $locationProvider) {

		$routeProvider

		.when("/sol/relatorios/cliente", {
			templateUrl: "sol/relatorios/cliente/cliente.html",
			controller: "relatorioCliente"
		});
		$locationProvider.html5Mode(true);
	}

})();
