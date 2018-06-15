function serialize(form){if(!form||form.nodeName!=="FORM"){return }var i,j,q=[];for(i=form.elements.length-1;i>=0;i=i-1){if(form.elements[i].name===""){continue}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"text":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value))}break;case"file":break}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=form.elements[i].options.length-1;j>=0;j=j-1){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value))}}break}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break}break}}return q.join("&")};

var al = {

  links: function(ajaxComponent){
    var links = ajaxComponent.querySelectorAll(".act-link");
    for(var j = 0; j < links.length; j++){
      links[j].ajaxComponent = ajaxComponent;
    }
    return links;
  },

  setOnClick: function(link){
    link.sent = function(responseText){
      this.ajaxComponent.update(responseText);
    }

    link.onclick = function(event){

      var request = new XMLHttpRequest();
      request.link = this;

      request.onload = function(){
        if(this.link.sent != null){
          this.link.sent(this.responseText);
        }
      }
      request.open("get", this.getAttribute("href"));
      request.send();

      return false;
    }
  },

  init: function(ajaxComponent){
    var links = this.links(ajaxComponent);

    for(var i = 0; i < links.length; i++){
      this.setOnClick(links[i]);
    }
  }
};

var af = {

  forms: function(ajaxComponent){
    var forms = ajaxComponent.querySelectorAll("form");
    for(var j = 0; j < forms.length; j++){
      forms[j].ajaxComponent = ajaxComponent;
      forms[j].submit = function(){
        this.onsubmit();
      };
    }
    return forms;
  },

  init: function(ajaxComponent){
    var forms = this.forms(ajaxComponent);

    for(var i = 0; i < forms.length; i++){
      this.setOnSubmit(forms[i]);
    }
  },

  setOnSubmit: function(form){

    form.sent = function(responseText){
      this.ajaxComponent.update(responseText);
    }

    form.onsubmit = function(event){

      var request = new XMLHttpRequest();
      request.form = this;

      request.onload = function(){
        if(this.form.sent != null){
          this.form.sent(this.responseText);
        }
      };

      var method = (this.getAttribute("method") == null)? "get": this.getAttribute("method");

      if(method == "get"){
        var formData = new FormData(this);
        var qs = serialize(this);
        // for(var pair of formData.entries()) {
        //   var concat = "&";
        //   concat = (qs === "")? "?": "&";
        //   qs = qs + concat + pair[0]+ '='+ pair[1];
        // }

        request.open("get", this.getAttribute("action") + "?" + qs);
        request.send();
      }
      else{
        //send thought post
        request.open("post", this.getAttribute("action"));
        request.send(new FormData(this));
      }

      return false;
    }

  },

};


var act = {

  //armazena os ajax-components da pagina
  ajaxComponents: null,

  /**
  Executado toda vez que um componente ajax eh carregado na pagina, independente de haver ou nao um erro
  */
  onComponentLoad: function(ajaxComponent){
    af.init(ajaxComponent);
    al.init(ajaxComponent);

    //execucao dos javascripts que vieram no ajax
    var scripts = ajaxComponent.getElementsByTagName("script");
    for(var i = 0; i < scripts.length; i++){
      eval(scripts[i].innerHTML);
    }
  },

  /**
  * Metodo: update
  * metodo de atualizacao do conteudo de um ajaxComponent.  Executado apos um get/post dentro de um ajax-component para carregar o novo conteudo.
  * dispara evento de atualizacao para notificar os ajax-components que precisam ser atualizados quando este aqui tem seu conteudo modificado.
  * Ver tambem: load
  */
  setUpdateFunc: function(ajaxComponent){
    ajaxComponent.update = function(responseText){

      if(this.beforeUpdate != null){
        this.beforeUpdate();
      }

      this.innerHTML = responseText;
      act.onComponentLoad(this);


      var id = this.getAttribute("id");
      if(id){
        var event = new Event(id + "_updated");
        document.dispatchEvent(event);
      }
    };
  },

  /**
  * configura um listenner para o evento gerado no update desse ajax-component.
  * esse listenner percorrera todos os ajax-components recarregando aqueles que escutam as modificacoes neste objeto.
  */
  setEventListener: function(ajaxComponent){
    var id = ajaxComponent.getAttribute("id");
    if(id){
      document.addEventListener(ajaxComponent.getAttribute("id") + "_updated", function (e) {
        //percorre todos os componentes que escutam esse evento recarregando-os
        for(var i = 0; i < act.ajaxComponents.length; i++){
          var reloadAfterUpdate = act.ajaxComponents[i].getAttribute("reload-after-update");
          if(reloadAfterUpdate){
            //remocao dos espacos da string
            reloadAfterUpdate = reloadAfterUpdate.split(' ').join('');
            var listenersIds = reloadAfterUpdate.split(",");

            for(var j = 0; j < listenersIds.length; j++){
              var id = listenersIds[j];
              if(id + "_updated" === e.type){
                act.ajaxComponents[i].load();
              }
            }
          }
        }
      }, false);
    }
  },

  /**
  * carrega, via ajax, o conteudo daqueles ajax-components que tem o atributo load-from-url preenchido
  * nao usa o metodo update para carregar o conteudo da response no html para nao disparar o evento de update
  */
  setOnLoadFunc: function(ajaxComponent){
    ajaxComponent.load = function(){

      //premissa: ajax-components que nao possuem load-from-url ja possuem conteudo diretamente dentro da tag
      if(!ajaxComponent.getAttribute("load-from-url")){
        act.onComponentLoad(ajaxComponent);
        return;
      }

      var xhttp = new XMLHttpRequest();
      xhttp.ajaxComponent = this;

      xhttp.onload = function() {
        this.ajaxComponent.innerHTML = (this.status == 200)? this.responseText: "";
        act.onComponentLoad(this.ajaxComponent);
      };

      xhttp.open("GET", xhttp.ajaxComponent.getAttribute("load-from-url"), true);
      xhttp.send();
    };
  },

  /**
  * Inicializa o act plugin carregando automaticamente todos os componentes ajax da pagina.
  */
  init: function(){
    this.ajaxComponents = document.getElementsByTagName("ajax-component");
    for(var i = 0; i < this.ajaxComponents.length; i++){

      //configuracao dos metodos da classe
      this.setUpdateFunc(this.ajaxComponents[i]);
      this.setEventListener(this.ajaxComponents[i]);
      this.setOnLoadFunc(this.ajaxComponents[i]);

      //carga do conteudo remoto
      this.ajaxComponents[i].load();
    }
  },

  ajaxComponent: function(id){
    for(var i = 0; i < this.ajaxComponents.length; i++){
      var idNoHtml = this.ajaxComponents[i].getAttribute("id");
      if(idNoHtml){
        if(idNoHtml === id){
          return this.ajaxComponents[i];
        }
      }
    }
    return null;
  }


};
