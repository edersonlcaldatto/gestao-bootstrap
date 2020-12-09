var AtividadeController = new function () {

	let baseUrl = "http://localhost:8080/atividades"; // "https://api-plataformasaude.herokuapp.com/atividades";

	this.getAtividades = function () {
		
		$.get({
			type: 'GET',
			url: baseUrl,
			headers: getToken(),
			success: (result) => loadAtividades(result),
			error: (xhr) => {
				alert("Erro ao buscar as Atividades: " + xhr.status + " - " + xhr.statusText)				
			},
		});		
	}

	this.delete = function (event) {
		let idAtividade = event.target.parentNode.parentNode.querySelector('.idAtividade').innerText;
		
		$.ajax({
			url: baseUrl + '/' + idAtividade,
			method: 'DELETE',
			contentType: 'application/json',
			headers: getToken(),
			success: (result) => AtividadeController.getAtividades(),
			error: function (request, msg, error) {
				alert('Erro ao deletar');
			}
		});
	}

	this.save = function () {
		var idAtividadeToEdit = $("#idAtividade").val();

		if (idAtividadeToEdit == null || idAtividadeToEdit == "") {
			var atividade = this.getDadosAtividadeModal();

			console.log(atividade);

			$.ajax({
				url: baseUrl,
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(atividade),
				headers: getToken(),
				success: function () {
					$("#idAtividade").val("");
					$('#cadastrarAtividade').modal('hide');
					AtividadeController.getAtividades();
					AtividadeController.limparDadosAtividadeModal();
				},
				error: function (request, msg, error) {
					$("#idAtividade").val("");
					$('#cadastrarAtividade').modal('hide');
					AtividadeController.getAtividades();
					AtividadeController.limparDadosAtividadeModal();
				}
			});
		}
		else {
			AtividadeController.update(idAtividadeToEdit);
		}
	}

	this.update = function (idAtividade) {
		var atividade = this.getDadosAtividadeModal();
		console.log("Update "+ idAtividade);
		console.log(atividade);

		$.ajax({
			url: baseUrl + '/' + idAtividade,
			method: 'PUT',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(atividade),
			headers: getToken(),
			success: function (result) {
				$("#idAtividade").val("");
				$('#cadastrarAtividade').modal('hide');
				AtividadeController.getAtividades();
				AtividadeController.limparDadosAtividadeModal();
			},
			error: function (request, msg, error) {
				$("#idAtividade").val("");
				$('#cadastrarAtividade').modal('hide');
				AtividadeController.getAtividades();
				AtividadeController.limparDadosAtividadeModal();
			}
		});
	}

	this.edit = function (event) {
		getProjetosJson(loadProjetos);
		getResponsaveisJson(loadResponsaveis);

		let idAtividade = event.target.parentNode.parentNode.querySelector('.idAtividade').innerText;
		
		$("#idAtividade").val(idAtividade);		
		
		$.get({
			type: 'GET',
			url: baseUrl + '/' + idAtividade,
			headers: getToken(),
			success: (data) => {
				$('#cadastrarAtividade').modal('show');
				AtividadeController.setDadosAtividadeModal(data);				
			}, 
			error: (xhr) => {
				alert("Erro ao buscar as Atividades: " + xhr.status + " - " + xhr.statusText)				
			},
		});			
	}

	this.setDadosAtividadeModal = function (atividade) {
		$('#atividadeProjeto').val(atividade.projeto.nome);
		$('#atividadeTarefa').val(atividade.task);
		$('#atividadeResponsavel').val(atividade.responsavel.nome);
		$('#atividadeStatus').val(atividade.status);
	}

	this.limparDadosAtividadeModal = function () {
		$('#atividadeProjeto').val("");
		$('#atividadeTarefa').val("");
		$('#atividadeResponsavel').val("");
		$('#atividadeStatus').val("");
	}

	this.getDadosAtividadeModal = function () {
		var atividade = {
			projeto: getProjeto(),
			task: $('#atividadeTarefa').val(),			
			responsavel: getResponsavel(),			
			status: $('#atividadeStatus').val(),
		}

		return atividade;
	}

    function getResponsavel() {
	   
        let valorCampo = $("#atividadeResponsavel").val();
        codigoResponsavel = $('#responsavelDataList option[value="' + valorCampo + '"]').attr('id');      
        return {
			idresponsavel: codigoResponsavel,
		};
				
	}
	
    function getProjeto() {
	   
        let valorCampo = $("#atividadeProjeto").val();
        codigoProjeto = $('#projetosDataList option[value="' + valorCampo + '"]').attr('id');      
        return {
			idprojeto: codigoProjeto,
		};
				
    }	

	function loadAtividades(atividadesJson) {

		$('#atividadesTableBody').empty();

		for (i = 0; i <= atividadesJson.length; i++) {
			adicionaAtividade(atividadesJson[i]);
		}

	}

	function adicionaAtividade(atividade) {
		let atividadeTr = montaTr(atividade);
		let tabela = document.getElementById("atividadesTableBody");
		tabela.appendChild(atividadeTr);
	}

	function montaTr(atividade) {
		console.log(atividade);
		
		let atividadeTr = document.createElement("tr");
		atividadeTr.classList.add("atividade");
		atividadeTr.appendChild(montaTd(atividade.idatividade, "idAtividade"));
		atividadeTr.appendChild(montaTd(atividade.projeto.nome, "projeto"));
		atividadeTr.appendChild(montaTd(atividade.task, "task"));
		atividadeTr.appendChild(montaTd(atividade.responsavel.nome, "responsavel"));
		atividadeTr.appendChild(montaTd(atividade.status, "status"));

		let td = document.createElement("td");
		td.classList = "actions";

		let a = document.createElement("a");
		a.classList = "btn btn-warning btn-xs btn-sm";
		a.addEventListener("click", AtividadeController.edit);
		a.innerText = "Editar";
		td.appendChild(a);

		let a1 = document.createElement("a");
		a1.classList = "btn btn-danger btn-xs btn-sm";
		a1.addEventListener("click", AtividadeController.delete);
		a1.innerText = "Excluir";
		td.appendChild(a1);

		atividadeTr.appendChild(td)

		return atividadeTr;
	}

	function montaTd(dado, classe) {
		let td = document.createElement("td");
		td.textContent = dado;
		td.classList.add(classe);

		return td;
	}

    this.populaLookups = function () {
		getProjetosJson(loadProjetos);
		getResponsaveisJson(loadResponsaveis);
	};

	function loadResponsaveis(responsaveisList){
        let responsaveisDtList = document.getElementById("responsavelDataList");

        while (responsaveisDtList.firstChild) {
            responsaveisDtList.removeChild(responsaveisDtList.firstChild);
        }

        for (i = 0; i <= responsaveisList.length; i++) {
			responsaveisDtList.appendChild(createOption(responsaveisList[i].idresponsavel, responsaveisList[i].nome));  
        }

	}
	
	function loadProjetos(projetosList){
        let projetosDtList = document.getElementById("projetosDataList");

        while (projetosDtList.firstChild) {
            projetosDtList.removeChild(projetosDtList.firstChild);
        }

        for (i = 0; i <= projetosList.length; i++) {
			projetosDtList.appendChild(createOption(projetosList[i].idprojeto, projetosList[i].nome));  
        }
	}

}
$(document).ready(AtividadeController.getAtividades());