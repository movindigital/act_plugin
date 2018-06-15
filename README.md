<h1>Act - Ajax Component Trasactions</h1>

<h2>O que é</h2>
<p>Plugin JS para criação de componentes Ajax.</p>
<p>A ideia é reduzir o uso de JavaScript transferindo diretamente HTML do servidor para o cliente.  Com o uso de Act é possível trocas de dados escrevendo apenas o código de inicialização do plugin e as tags dos componentes.</p>
<p>Ao invés de ter uma página grande e complexa, act permite ter uma página grande com pequenos componentes responsáveis por tarefas específicas.  Isso torna a manutenção do código muito mais simples.</p>

<h2>Quando usar</h2>
<p>- na criação de formulários de cadastro com validação do lado servidor;</p>
<p>- nas listagens, com ou sem filtros/ordenações/paginação;</p>
<p>- nos cadastros que possuam muitos passos;</p>
<p>- na exibição de blocos de código complexos, como, por exemplo, carrosséis, gráficos.</p>

<p>Obs.: em alguns casos, é preciso inicializar o plugin dentro do componente.  No caso do Carousel do Bootstrap, por exemplo, abaixo do código HTML é preciso adicionar o script abaixo:</p>

<code>
<script type="text/javascript">
  $('.carousel').carousel();
</script>
</code>

<p>No caso do Modal do bootstrap, é preciso fechá-lo no método beforeUpdate caso ele esteja aberto:</p>
<code>
act.ajaxComponent("id_do_ajax_componente").beforeUpdate = function(){
	$('.modal').modal('hide');
};
</code>

<h2>Quando não usar</h2>
<p>Se os dados gerados pelo servidor serão lidos em diversas plataformas (aplicativo + navegador, por exemplo), cada plataforma terá sua forma específica de criação da interface.  Nesses casos é preferível transferir o dado sem HTML e por isso nesse contexto o uso de Act não se aplica.</p>

<h2>Exemplo Hello World!</h2>

hello.php
-----------
<code>
<h1>Hello World!</h1>
</code>


index.php
-----------
<code>
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
</code>

<h2>Compatibilidade</h2>

<h3>Posso colocar JS no componente?</h3>
<p>Pode.  A restrição é o uso de eventos em tags HTML.</p>
<p>O código abaixo não funciona:</p>

componente.php
--------------
<code>
<div onclick="hello();">Diga hello</div>

<script type="text/javascript">
	function hello(){
		alert("hello");
	}
</script>
</code>
<p>Já a versão seguinte não apresenta problemas:</p>

componente.php
--------------
<code>
<div id="diga_hello">Diga hello</div>
<script type="text/javascript">
	document.getElementById("diga_hello").onclick = function(){
		alert("hello");
	};
</script>
</code>
