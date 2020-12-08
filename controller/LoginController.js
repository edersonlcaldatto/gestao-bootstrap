var LoginController = new function () {

	let baseUrl = "http://localhost:8080/auth"; // "https://api-plataformasaude.herokuapp.com/responsaveis";

	this.logar = function (event) {
		event.preventDefault();
        login = {
            login: $("#inputLogin").val(),
            password: $("#inputPassword").val(),
        }  
        
        
        $.ajax({
            url: baseUrl,
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            dataType: "json",
            data: JSON.stringify(login),
            success: (result) => liberaAcesso(result),
            error: function (request, msg, error) {
                alert("Usuário ou Senha inválidos");             
            }
        });
    }


    function liberaAcesso(token){
        console.log(token);
        sessionStorage.setItem('acess_token', token.token);
        sessionStorage.setItem('acess_type', token.tipo);
        window.location = '/pages/home.html';
    }
}    