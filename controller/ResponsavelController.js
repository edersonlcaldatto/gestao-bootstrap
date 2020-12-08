var ResponsavelController = new function () {

	let baseUrl = "http://localhost:8080/responsaveis"; // "https://api-plataformasaude.herokuapp.com/responsaveis";

	this.getResponsaveis = function () {
		
		$.get({
			type: 'GET',
			url: baseUrl,
			headers: getToken(),
			success: (result) => loadResponsaveis(result),
			error: (xhr) => {
				alert("Erro ao buscar as Responsaveis: " + xhr.status + " - " + xhr.statusText)				
			},
		});		
	}

	this.delete = function (event) {
		let idResponsavel = event.target.parentNode.parentNode.querySelector('.idResponsavel').innerText;
		
		$.ajax({
			url: baseUrl + '/' + idResponsavel,
			method: 'DELETE',
			contentType: 'application/json',
			headers: getToken(),
			success: (result) => ResponsavelController.getResponsaveis(),
			error: function (request, msg, error) {
				alert('Erro ao deletar');
			}
		});
	}

	this.save = function () {
		var idResponsavelToEdit = $("#idResponsavel").val();

		if (idResponsavelToEdit == null || idResponsavelToEdit == "") {
			var cliente = this.getDadosResponsavelModal();

			$.ajax({
				url: baseUrl,
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(cliente),
				headers: getToken(),
				success: function () {
					$("#idResponsavel").val("");
					$('#cadastrarResponsavel').modal('hide');
					ResponsavelController.getResponsaveis();
					ResponsavelController.limparDadosResponsavelModal();
				},
				error: function (request, msg, error) {
					$("#idResponsavel").val("");
					$('#cadastrarResponsavel').modal('hide');
					ResponsavelController.getResponsaveis();
					ResponsavelController.limparDadosResponsavelModal();
				}
			});
		}
		else {
			ResponsavelController.update(idResponsavelToEdit);
		}
	}

	this.update = function (idResponsavel) {
		var cliente = this.getDadosResponsavelModal();

		$.ajax({
			url: baseUrl + '/' + idResponsavel,
			method: 'PUT',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(cliente),
			headers: getToken(),
			success: function (result) {
				$("#idResponsavel").val("");
				$('#cadastrarResponsavel').modal('hide');
				ResponsavelController.getResponsaveis();
				ResponsavelController.limparDadosResponsavelModal();
			},
			error: function (request, msg, error) {
				$("#idResponsavel").val("");
				$('#cadastrarResponsavel').modal('hide');
				ResponsavelController.getResponsaveis();
				ResponsavelController.limparDadosResponsavelModal();
			}
		});
	}

	this.edit = function (event) {
		let idResponsavel = event.target.parentNode.parentNode.querySelector('.idResponsavel').innerText;

		$("#idResponsavel").val(idResponsavel);
		
		$.get(baseUrl + '/' + idResponsavel, function (data) {
			$('#cadastrarResponsavel').modal('show');
			ResponsavelController.setDadosResponsavelModal(data);
		});
	}

	this.setDadosResponsavelModal = function (responsavel) {
		$('#responsavelNome').val(responsavel.nome);
		$('#responsavelFuncao').val(responsavel.funcao);
	}

	this.limparDadosResponsavelModal = function () {
		$('#responsavelNome').val("");
		$('#responsavelFuncao').val("");
	}

	this.getDadosResponsavelModal = function () {
		var responsavel = {
			nome: $('#responsavelNome').val(),
			funcao: $('#responsavelFuncao').val(),
		}

		return responsavel;
	}

	function loadResponsaveis(responsaveisJson) {

		$('#responsaveisTableBody').empty();

		for (i = 0; i <= responsaveisJson.length; i++) {
			adicionaResponsavel(responsaveisJson[i]);
		}

	}

	function adicionaResponsavel(responsavel) {
		let clienteTr = montaTr(responsavel);
		let tabela = document.getElementById("responsaveisTableBody");
		tabela.appendChild(clienteTr);
	}

	function montaTr(responsavel) {
		let responsavelTr = document.createElement("tr");
		responsavelTr.classList.add("responsavel");
		responsavelTr.appendChild(montaTd(responsavel.idresponsavel, "idResponsavel"));
		responsavelTr.appendChild(montaTd(responsavel.nome, "nome"));
		responsavelTr.appendChild(montaTd(responsavel.funcao, "funcao"));

		let td = document.createElement("td");
		td.classList = "actions";

		let a = document.createElement("a");
		a.classList = "btn btn-warning btn-xs btn-sm";
		a.addEventListener("click", ResponsavelController.edit);
		a.innerText = "Editar";
		td.appendChild(a);

		let a1 = document.createElement("a");
		a1.classList = "btn btn-danger btn-xs btn-sm";
		a1.addEventListener("click", ResponsavelController.delete);
		a1.innerText = "Excluir";
		td.appendChild(a1);

		responsavelTr.appendChild(td)

		return responsavelTr;
	}

	function montaTd(dado, classe) {
		let td = document.createElement("td");
		td.textContent = dado;
		td.classList.add(classe);

		return td;
	}

}
$(document).ready(ResponsavelController.getResponsaveis());