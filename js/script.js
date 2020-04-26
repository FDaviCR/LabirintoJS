(function(){
	//elemento canvas e contexto de renderização
	var cnv = document.querySelector("canvas");
	var ctx = cnv.getContext("2d");

	var WIDTH = cnv.width, HEIGHT = cnv.height;

	//armazenando valores das teclas
	const LEFT = 37;
	const UP = 38;
	const RIGHT = 39;
	const DOWN = 40;

	var mvLeft = mvUp = mvRight = mvDown = false;

	//tamanho dos blocos
	var tileSize = 32;

	var walls = [];

	//desenho do player
	var player = {
		x: tileSize + 2,
		y: tileSize + 2,
		width: 20,
		height: 20,
		speed: 2
	}

	//mapa do labirinto
	var maze = [
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,1],
		[1,1,1,0,1,1,1,0,0,1,0,0,0,1,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,1,1,1,1,1,1,0,1,1,1,1,1],
		[1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,1,1,1,1,1,1,1,1,1,0,1],
		[1,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,0,1,1,1,1,1,0,0,1,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,1,1,0,1,1,1,1,1,0,1,1,1,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,1],
		[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
	];

	for(var row in maze){
		for(var column in maze[row]){
			var tile = maze[row][column];
			if(tile === 1){
				var wall = {
					x: tileSize*column,
					y: tileSize*row,
					width: tileSize,
					height: tileSize
				};
				walls.push(wall);
			}
		}
	}

	var esq = 0;
	var cim = 0;
	var dir = 0;
	var bai = 0;

	function blockRectangle(objA, objB){
		var distX = (objA.x + objA.width/2) - (objB.x + objB.width/2);
		var distY = (objA.y + objA.height/2) - (objB.y + objB.height/2);

		var sumWidth = (objA.width + objB.width)/2;
		var sumHeight = (objA.height + objB.height)/2;

		if(Math.abs(distX) < sumWidth && Math.abs(distY) < sumHeight){
			var overlapX = sumWidth - Math.abs(distX);
			var overlapY = sumHeight - Math.abs(distY);

			if(overlapX > overlapY){
				objA.y = distY > 0 ? objA.y + overlapY : objA.y - overlapY;
			} else{
				objA.x = distX > 0 ? objA.x + overlapX : objA.x - overlapX;
			}
		}
	}

	window.addEventListener('keydown',keydownHandler, false);
	window.addEventListener('keyup',keyupHandler, false);

	function keydownHandler(event) {
		var key = event.keyCode;
		switch (key){
			case LEFT: 
				mvLeft = true;
				esq=esq+1;
				document.getElementById('esquerda').innerHTML = esq;
				break;
			case UP:
				mvUp = true;
				cim=cim+1;
				document.getElementById('cima').innerHTML = cim;
				break;
			case RIGHT:
				mvRight = true;
				dir=dir+1;
				document.getElementById('direita').innerHTML = dir;
				break;
			case DOWN:
				mvDown = true;
				bai=bai+1;
				document.getElementById('baixo').innerHTML = bai;
				break;
		}
	}

	function keyupHandler(event) {
		var key = event.keyCode;
		switch (key){
			case LEFT: 
				mvLeft = false;
				break;
			case UP:
				mvUp = false;
				break;
			case RIGHT:
				mvRight = false;
				break;
			case DOWN:
				mvDown = false;
				break;
		}
	}

	//atualização cíclica do programa
	function update(){
		if(mvLeft && !mvRight){
			player.x -= player.speed;
		}else
		if(!mvLeft && mvRight){
			player.x += player.speed;
		}
		if(mvUp && !mvDown){
			player.y -= player.speed;
		}else
		if(!mvUp && mvDown){
			player.y += player.speed;
		}

		for(var i in walls){
			var wall = walls[i];
			blockRectangle(player, wall);
		}
	}

	//renderização (desenha na tela)
	function render(){
		ctx.clearRect(0,0,WIDTH,HEIGHT);
		ctx.save();
		//procedimento que varre as linhas e colunas do labirinto
		for(var row in maze){
			for(var column in maze[row]){
				//pega o elemento armazenado em uma determinada linha/coluna
				var tile = maze[row][column];
				//se for um tijolo...
				if(tile === 1){
					//...especifica as dimensões e a posição...
					var x = column*tileSize;
					var y = row*tileSize;
					//...e desenha na tela
					ctx.fillRect(x,y,tileSize,tileSize);
				}
			}
		}
		ctx.fillStyle = "#00f";
		ctx.fillRect(player.x,player.y,player.width,player.height);
		ctx.restore();
	}

	function loop(){
		update();
		render();
		requestAnimationFrame(loop,cnv);

	}

	requestAnimationFrame(loop,cnv);
}());
