var ProjetoController = new function () {

	let baseUrl = "http://localhost:8080/projetos"; // "https://api-plataformasaude.herokuapp.com/projetos";

	this.getProjetos = function () {
		
		$.get({
			type: 'GET',
			url: baseUrl,
			headers: getToken(),
			success: (result) => loadProjetos(result),
			error: (xhr) => {
				alert("Erro ao buscar as Projetos: " + xhr.status + " - " + xhr.statusText)				
			},
		});		
	}

	this.delete = function (event) {
		let idProjeto = event.target.parentNode.parentNode.querySelector('.idProjeto').innerText;
		
		$.ajax({
			url: baseUrl + '/' + idProjeto,
			method: 'DELETE',
			contentType: 'application/json',
			headers: getToken(),
			success: (result) => ProjetoController.getProjetos(),
			error: function (request, msg, error) {
				alert('Erro ao deletar');
			}
		});
	}

	this.save = function () {
		var idProjetoToEdit = $("#idProjeto").val();

		if (idProjetoToEdit == null || idProjetoToEdit == "") {
			var projeto = this.getDadosProjetoModal();

			$.ajax({
				url: baseUrl,
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				data: JSON.stringify(projeto),
				headers: getToken(),
				success: function () {
					$("#idProjeto").val("");
					$('#cadastrarProjeto').modal('hide');
					ProjetoController.getProjetos();
					ProjetoController.limparDadosProjetoModal();
				},
				error: function (request, msg, error) {
					$("#idProjeto").val("");
					$('#cadastrarProjeto').modal('hide');
					ProjetoController.getProjetos();
					ProjetoController.limparDadosProjetoModal();
				}
			});
		}
		else {
			ProjetoController.update(idProjetoToEdit);
		}
	}

	this.update = function (idProjeto) {
		var projeto = this.getDadosProjetoModal();
		console.log(JSON.stringify(projeto));
		$.ajax({
			url: baseUrl + '/' + idProjeto,
			method: 'PUT',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(projeto),
			headers: getToken(),
			success: function (result) {
				$("#idProjeto").val("");
				$('#cadastrarProjeto').modal('hide');
				ProjetoController.getProjetos();
				ProjetoController.limparDadosProjetoModal();
			},
			error: function (request, msg, error) {
				$("#idProjeto").val("");
				$('#cadastrarProjeto').modal('hide');
				ProjetoController.getProjetos();
				ProjetoController.limparDadosProjetoModal();
			}
		});
	}

	this.edit = function (event) {
		getClientesJson(loadClientes);
		let idProjeto = event.target.parentNode.parentNode.querySelector('.idProjeto').innerText;

		$("#idProjeto").val(idProjeto);

		$.get({
			type: 'GET',
			url: baseUrl + '/' + idProjeto,
			headers: getToken(),
			success: (data) => {
				$('#cadastrarProjeto').modal('show');
				ProjetoController.setDadosProjetoModal(data);			
			}
		});			
	}

	this.setDadosProjetoModal = function (projeto) {
		$('#projetoNome').val(projeto.nome);
		$('#projetoCliente').val(projeto.cliente.nome);
		$('#projetoDescricao').val(projeto.descricao);		
	}

	this.limparDadosProjetoModal = function () {
		$('#projetoNome').val("");
		$('#projetoCliente').val("");
		$('#projetoDescricao').val("");
	}

	this.getDadosProjetoModal = function () {
		var projeto = {
			nome: $('#projetoNome').val(),
			cliente: getCliente(),
			descricao: $('#projetoDescricao').val()
		}

		return projeto;
	}

    function getCliente() {
		let valorCampo = $("#projetoCliente").val();
        codigoCliente = $('#clientesDataList option[value="' + valorCampo + '"]').attr('id');      
        return {
			idcliente: codigoCliente,
		};				
    }	

	function loadProjetos(projetosJson) {

		$('#projetosTableBody').empty();

		for (i = 0; i <= projetosJson.length; i++) {
			adicionaProjeto(projetosJson[i]);
		}

	}

	function adicionaProjeto(projeto) {
		let projetoTr = montaTr(projeto);
		let tabela = document.getElementById("projetosTableBody");
		tabela.appendChild(projetoTr);
	}

	function montaTr(projeto) {
		let projetoTr = document.createElement("tr");
		projetoTr.classList.add("projeto");
		projetoTr.appendChild(montaTd(projeto.idprojeto, "idProjeto"));
		projetoTr.appendChild(montaTd(projeto.nome, "nome"));
		projetoTr.appendChild(montaTd(projeto.cliente.nome, "cliente"));
		projetoTr.appendChild(montaTd(projeto.descricao, "descricao"));

		let td = document.createElement("td");
		td.classList = "actions";

		let a = document.createElement("a");
		a.classList = "btn btn-warning btn-xs btn-sm";
		a.addEventListener("click", ProjetoController.edit);
		a.innerText = "Editar";
		td.appendChild(a);

		let a1 = document.createElement("a");
		a1.classList = "btn btn-danger btn-xs btn-sm";
		a1.addEventListener("click", ProjetoController.delete);
		a1.innerText = "Excluir";
		td.appendChild(a1);

		projetoTr.appendChild(td)

		return projetoTr;
	}

	function montaTd(dado, classe) {
		let td = document.createElement("td");
		td.textContent = dado;
		td.classList.add(classe);

		return td;
	}

    this.populaLookups = function () {
        getClientesJson(loadClientes);
	};
	
    function loadClientes(clientesList) {

        let clientesDtList = document.getElementById("clientesDataList");

        while (clientesDtList.firstChild) {
            clientesDtList.removeChild(clientesDtList.firstChild);
        }

        for (i = 0; i <= clientesList.length; i++) {
			clientesDtList.appendChild(createOption(clientesList[i].idcliente, clientesList[i].nome));  
        }
    } 	

}
$(document).ready(ProjetoController.getProjetos());