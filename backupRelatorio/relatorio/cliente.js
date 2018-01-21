"use strict";

var LancamentoServicosEspeciais = require("../../../models/LancamentoServicosEspeciais");
var moment = require("moment");

module.exports = function(app) {
	app.get("/api/relatorios/cliente", function(req, res) {//getPage

		let total = 0;
		let pagesNumber = 0;

		let inicio;
		let final;

		let options = {
			fields: {
				lan_especial:     ["id","participante_id","cedente_id","localidade_id","registro_id","pagamento_id","setor_id","data","valor","descricao","finalizado","faturamento_id","total_prestador","total_fornecedor", "finalizado"],
				participante:     ["nome as cliente"],
				registro:         ["nome as formaPagamento"],
				registro2:        ["nome as servico_registro"],
				setor:            ["nome as setor"],
				localidade:       ["cidade","sigla"],
				localidade2:      ["regional_id"],
				estado2:          ["sigla as estado"],
				lan_especial_det2:["COUNT(lan_especial_det2.id) as num_total_pre_for","GROUP_CONCAT(CAST(lan_especial_det2.faturamento_id AS CHAR) ORDER BY lan_especial_det2.id) as faturadas_f_p"]
			},
			group: "lan_especial.id"
			,joins: [
				"participante","registro","setor","localidade",
				{
					type    : "left",
					table   : "lan_especial_det",
					alias   : "lan_especial_det2",
					on      : "lan_especial.id = lan_especial_det2.lan_especial_id"
				},
				{
					type    : "inner",
					table   : "localidade",
					alias   : "localidade2",
					on      : "localidade2.id = participante.localidade_id"
				},
				{
					type    : "inner",
					table   : "estado",
					alias   : "estado2",
					on      : "localidade.estado_id = estado2.id"
				},
				{
					type:"inner",
					table:"registro",
					alias:"registro2",
					on:"registro2.id = lan_especial.registro_id"
				}

			],
			sort: {
				field: "lan_especial.data desc, lan_especial.id",
				reverse: false
			}
		};
		if(req.query.page) {
			options.page  = req.query.page;
			options.limit = 5;
		}

		if(req.query.search) {
			options.search  = JSON.parse(req.query.search);
		}

		if(req.query.sort) {
			options.sort = JSON.parse(req.query.sort);
		}
		if(req.query.inicio) {
			inicio = moment(new Date(req.query.inicio)).utc().format("YYYY-MM-DD");
			options.where.push("lan_especial.data >= '" + inicio + "'");
		}

		if(req.query.final) {
			final = moment(new Date(req.query.final)).utc().format("YYYY-MM-DD");
			options.where.push("lan_especial.data <= '" + final + "'");
		}
		LancamentoServicosEspeciais.find(options, function(error, rows) {

			if (error) {

				res.status(500).send({
					message: error.message,
					error:error,
					msg: "Erro ao buscar a contagem total de serviços especiais"
				});

			} else {

				if(options.page) {

					LancamentoServicosEspeciais.count(options, function(error, result) {

						if(error) {

							res.status(500).send({
								error: error,
								msg: "Erro ao buscar a contagem total de serviços especiais"
							});

						} else {

							total       = result[0].total;
							pagesNumber = Math.ceil(total / 5);

							res.status(200).send({
								total: total,
								pagesNumber: pagesNumber,
								servicos_especiais: rows
							});

						}
					});

				} else {

					res.status(200).send(rows);

				}
			}

		});
	});
	
};
