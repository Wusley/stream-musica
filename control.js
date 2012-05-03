	//EXECUTANDO STREAM DE MUSICA
	
		//para criar o servidor web
	var http 		= require('http'),
	
		//para trabalhar com arquivos
		fileSystem 	= require('fs'),
		
		//localizar o arquivo
		path 		= require('path'),
		
		//
		util 		= require('util');

	http.createServer(function(request,response){
		
		//strPath = dizer onde esta o arquivo
		//path.join = montar o caminho
		//__dirname = indica o caminho onde o nodejs esta instalado
		var strPath = path.join(__dirname,'musica.mp3');
		
		//pegar o status do arquivo para indicar
		//a parte do arquivo que esta servindo
		var objStat = fileSystem.statSync(strPath);
		
		/*
		200 = codigo da pagina que foi entregue
		Content-type:audio/mpeg se refere ao tipo de conteúdo que estara no 
		cabeçalho da pagina
		Content-type:objStat.size pegando o tamanho do arquivo com o metodo
		*/
		response.writeHead(200, {"Content-Type":"audio/mpeg","Content-Lenght":objStat.size});
		
		//readStream = objeto de stream para leitura do fileSystem
		var readStream = fileSystem.createReadStream(strPath);
		
		//mostrar os dados em stream na tela
		readStream.on('data',function(data){
			
			response.write(data);
			
		});
		
		//evento com efeito semelhante ao util.pump
		readStream.on('data',function(data){
			
			//receber os dados que estão sendo 
			//impressos na tela em uma variavel
			var flushed = response.write(data);
			
			//verifica se existe algum pacote no buffer
			if(!flushed) {
				
				//para o stream
				readStream.pause();
			
			} else {
				
				//lança na tela
				response.write(data);
			
			}
			
		});
		
		//drain = é chamado quando há algo no buffer
		readStream.on('drain',function(){
			
			//resume = retorna a leitura do arquivo do ponto de onde parou
			readStream.resume();
			
		});
		
		//evento para o final do arquivo
		readStream.on('end',function(){
			
			//fechar a conexao com browser
			response.end();
			
		});
		
		//otimiza o stream
		//evitar estouro de buffer
		//util.pump(readStream, response);
		
	//definindo a porta
	});
	
	var port = process.env.PORT || 3000;
	
	server.listen(port);