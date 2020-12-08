const baseUrl = "http://localhost:8080";

  function getClientesJson(callback) {
    $.get({
      type: "GET",
      url: baseUrl + "/clientes",
      headers: getToken(),
      success: function (result) {
        console.log(result);
        return callback(result);
      },
      error: (xhr) => {
        alert(
          "Erro ao buscar as Clientes: " + xhr.status + " - " + xhr.statusText
        );
      },
    });
  }

  function getProjetosJson(callback) {
    $.get({
      type: "GET",
      url: baseUrl + "/projetos",
      headers: getToken(),
      success: function (result) {
        console.log(result);
        return callback(result);
      },
      error: (xhr) => {
        alert(
          "Erro ao buscar as Projetos: " + xhr.status + " - " + xhr.statusText
        );
      },
    });
  }

  function getResponsaveisJson(callback) {
    $.get({
      type: "GET",
      url: baseUrl + "/responsaveis",
      headers: getToken(),
      success: function (result) {
        console.log(result);
        return callback(result);
      },
      error: (xhr) => {
        alert(
          "Erro ao buscar as Responsáveis: " + xhr.status + " - " + xhr.statusText
        );
      },
    });
  }

  function getToken(){
    return {
      Authorization: sessionStorage.getItem('acess_type') +' '+ sessionStorage.getItem('acess_token')
    }     
  }
  

  function createOption(id, value){
    let option = document.createElement("option");
    option.id = id;
    option.value = value;
    return option;
  }