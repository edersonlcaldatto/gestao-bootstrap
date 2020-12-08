var ClienteController = new function () {

	let baseUrl = "http://localhost:8080/clientes"; // "https://api-plataformasaude.herokuapp.com/clientes";

	this.getClientes = function () {
		
		$.get({
			type: 'GET',
			url: baseUrl,
			headers: getToken(),
			success: (result) => loadClientes(result),
			error: (xhr) => {
				alert("Erro ao buscar as Clientes: " + xhr.status + " - " + xhr.statusText)				
			},
		});		
	}

	this.delete = function (event) {
		let idCliente = event.target.parentNode.parentNode.querySelector('.idCliente').innerText;
		
		$.ajax({
			url: baseUrl + '/' + idCliente,
			method: 'DELETE',
			contentType: 'application/json',
			headers: getToken(),			
			success: (result) => ClienteController.getClientes(),
			error: function (request, msg, error) {
				alert('Erro ao deletar');
			}
		});
	}

	this.save = function () {
		var idClienteToEdit = $("#idCliente").val();

		if (idClienteToEdit == null || idClienteToEdit == "") {
			var cliente = this.getDadosClienteModal();

			$.ajax({
				url: baseUrl,
				type: 'POST',
				contentType: "application/json; charset=utf-8",
				headers: getToken(),
				dataType: "json",
				data: JSON.stringify(cliente),
				success: function () {
					$("#idCliente").val("");
					$('#cadastrarCliente').modal('hide');
					ClienteController.getClientes();
					ClienteController.limparDadosClienteModal();
				},
				error: function (request, msg, error) {
					$("#idCliente").val("");
					$('#cadastrarCliente').modal('hide');
					ClienteController.getClientes();
					ClienteController.limparDadosClienteModal();
				}
			});
		}
		else {
			ClienteController.update(idClienteToEdit);
		}
	}

	this.update = function (idCliente) {
		var cliente = this.getDadosClienteModal();

		$.ajax({
			url: baseUrl + '/' + idCliente,
			method: 'PUT',
			contentType: "application/json; charset=utf-8",
			dataType: "json",
			data: JSON.stringify(cliente),
			headers: getToken(),
			success: function (result) {
				$("#idCliente").val("");
				$('#cadastrarCliente').modal('hide');
				ClienteController.getClientes();
				ClienteController.limparDadosClienteModal();
			},
			error: function (request, msg, error) {
				$("#idCliente").val("");
				$('#cadastrarCliente').modal('hide');
				ClienteController.getClientes();
				ClienteController.limparDadosClienteModal();
			}
		});
	}

	this.edit = function (event) {
		let idCliente = event.target.parentNode.parentNode.querySelector('.idCliente').innerText;

		$("#idCliente").val(idCliente);
		
		$.get(baseUrl + '/' + idCliente, function (data) {
			$('#cadastrarCliente').modal('show');
			ClienteController.setDadosClienteModal(data);
		});
	}

	this.setDadosClienteModal = function (cliente) {
		$('#clienteNome').val(cliente.nome);
		$('#clienteCnpj').val(cliente.cnpj);
	}

	this.limparDadosClienteModal = function () {
		$('#clienteNome').val("");
		$('#clienteCnpj').val("");
	}

	this.getDadosClienteModal = function () {
		var cliente = {
			nome: $('#clienteNome').val(),
			cnpj: $('#clienteCnpj').val(),
		}

		return cliente;
	}

	function loadClientes(clientesJson) {

		$('#clientesTableBody').empty();

		for (i = 0; i <= clientesJson.length; i++) {
			adicionaCliente(clientesJson[i]);
		}

	}

	function adicionaCliente(cliente) {
		let clienteTr = montaTr(cliente);
		let tabela = document.getElementById("clientesTableBody");
		tabela.appendChild(clienteTr);
	}

	function montaTr(cliente) {
		let clienteTr = document.createElement("tr");
		clienteTr.classList.add("cliente");
		clienteTr.appendChild(montaTd(cliente.idcliente, "idCliente"));
		clienteTr.appendChild(montaTd(cliente.nome, "nome"));
		clienteTr.appendChild(montaTd(cliente.cnpj, "cnpj"));
		clienteTr.appendChild(montaTd(moment(cliente.dtcadastro).format("DD/MM/yyyy"), "dtcadastro"));
		clienteTr.appendChild(montaTd(moment(cliente.dtalteracao).format("DD/MM/yyyy"), "dtalteracao"));

		let td = document.createElement("td");
		td.classList = "actions";

		let a = document.createElement("a");
		a.classList = "btn btn-warning btn-xs btn-sm";
		a.addEventListener("click", ClienteController.edit);
		a.innerText = "Editar";
		td.appendChild(a);

		let a1 = document.createElement("a");
		a1.classList = "btn btn-danger btn-xs btn-sm";
		a1.addEventListener("click", ClienteController.delete);
		a1.innerText = "Excluir";
		td.appendChild(a1);

		clienteTr.appendChild(td)

		return clienteTr;
	}

	function montaTd(dado, classe) {
		let td = document.createElement("td");
		td.textContent = dado;
		td.classList.add(classe);

		return td;
	}

}
$(document).ready(ClienteController.getClientes());