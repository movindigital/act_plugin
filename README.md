#Act - Ajax Component Trasactions

##O que é
Plugin JS para criação de componentes Ajax.
A ideia é reduzir o uso de JavaScript transferindo diretamente HTML do servidor para o cliente.  Com o uso de Act é possível trocas de dados escrevendo apenas o código de inicialização do plugin e as tags dos componentes.
Ao invés de ter uma página grande e complexa, act permite ter uma página grande com pequenos componentes responsáveis por tarefas específicas.  Isso torna a manutenção do código muito mais simples.

##Quando usar
- na criação de formulários de cadastro com validação do lado servidor;
- nas listagens, com ou sem filtros/ordenações/paginação;
- nos cadastros que possuam muitos passos;
- na exibição de blocos de código complexos, como, por exemplo, carrosséis, gráficos*.

* em alguns casos, é preciso inicializar o plugin dentro do componente.  No caso do Carousel do Bootstrap, por exemplo, abaixo do código HTML é preciso adicionar o script abaixo:

<script type="text/text/javascript">
  $('.carousel').carousel();
</script>

No caso do Modal do bootstrap, é preciso fechá-lo no método beforeUpdate caso ele esteja aberto:
act.ajaxComponent("id_do_ajax_componente").beforeUpdate = function(){
	$('.modal').modal('hide');
};

##Quando não usar
Se os dados gerados pelo servidor serão lidos em diversas plataformas (aplicativo + navegador, por exemplo), cada plataforma terá sua forma específica de criação da interface.  Nesses casos é preferível transferir o dado sem HTML e por isso nesse contexto o uso de Act não se aplica.

##Exemplo Hello World!

hello.php
-----------
<h1>Hello World!</h1>


index.php
-----------
<!doctype html>
<html>
    <body>
	
	<ajax-component load-from-url="hello.php"></ajax-component>
	
	<script type="text/javascript" src="act.js"></script>
	<script type="text/javascript">
		act.init();
    </script>
	
	</body>
</html>


##Compatibilidade

###Posso colocar JS no componente?
Pode.  A restrição é o uso de eventos em tags HTML.  

O código abaixo não funciona:

componente.php
<div onclick="hello();">Diga hello</div>

<script type="text/javascript">
	function hello(){
		alert("hello");
	}
</script>

Já a versão seguinte não apresenta problemas:

componente.php
<div id="diga_hello">Diga hello</div>
<script type="text/javascript">
	document.getElementById("diga_hello").onclick = function(){
		alert("hello");
	};
</script>
