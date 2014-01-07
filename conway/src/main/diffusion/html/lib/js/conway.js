var topicName = "conway";
var gameName = "default";

var active = false;
var mousedown = false;
var touchdown = false;

var res = 600;

var gridSize = 50;
var squareSize = res/gridSize;

var scores = new Array(10);
for(var i=0; i<10; i++) {
	scores[i] = 0;
}

var gridState = new Array(gridSize);
for (var x=0; x<gridSize; x++) {
	gridState[x] = new Array(gridSize);
	for (var y=0; y<gridSize; y++) {
		gridState[x][y] = 0;
	}
}

var connections = new Array(10);
for(var i=0; i<10; i++) {
	connections[i] = 0;
}

var colours = new Array(20);

var pieSlice = 0;

colours[0] = '0f0';
colours[1] = '00f';
colours[2] = 'f00';
colours[3] = 'f0f';
colours[4] = 'ff0';
colours[5] = '0ff';
colours[6] = '9c9';
colours[7] = 'f60';
colours[8] = 'c9c';
colours[9] = 'fff';
colours[10] = '050';
colours[11] = '005';
colours[12] = '500';
colours[13] = '505';
colours[14] = '550';
colours[15] = '055';
colours[16] = '242';
colours[17] = '520';
colours[18] = '424';
colours[19] = '555';

/**
 * Called when a message is delivered from Diffusion
 * 
 * @param webClientMessage
 *            Message from Diffusion
 */
function onDataEvent(webClientMessage) {	
	
	var topics = webClientMessage.topic.split("/");
	if(topics.length > 2) {
		var basetopic = topics[3];
		
		if(basetopic == "SquareState") {
			var subtopic = topics[4];
			
			var x=0;
			while(webClientMessage.hasRemaining()) {
				var field= webClientMessage.nextField();
				if(field != "" && field != undefined && subtopic != "" && subtopic != undefined) {
					gridState[x][parseInt(subtopic,10)] = parseInt(field,10);
				}			
				x++;
			}
		}
		else if(basetopic == "Players") {
			var subtopic = topics[4];
			if(subtopic == "Connected") {
				var id = 0;
				while (webClientMessage.hasRemaining()) {
					var record = webClientMessage.nextRecord();
					
					var conn = record.getField(1);
					var score = record.getField(2);
					
					if(conn != undefined && conn != "") {
						connections[id] = conn;
					}
					if(score != undefined && score != "") {
						scores[id] = score;
					}
					
					updateText("player"+(id+1),"Player "+(id+1)+": "+scores[id], id);
					id++;
				}
			}
		}
		else if(basetopic == "Counter") {
			pieSlice = webClientMessage.getFields(0)[0];
			tickerInstance.loop();
		}
	}
}

function updateText(fieldName, text, i) {
	var fieldNameElement = document.getElementById(fieldName);
	fieldNameElement.innerHTML = text;
	if(connections[i]==0){
		i=i+10;
	}
	fieldNameElement.style.color = "#"+colours[i];
}

/**
 * Called on mouse clicks. This method figures out which square is clicked, and sends that as a message.
 */
function mouseHandler(e) {
	if(!active)
		return;
	e.preventDefault();
	var canvas = document.getElementById("main");
	var mouseX = e.pageX - canvas.offsetLeft;
	var mouseY = e.pageY - canvas.offsetTop;
	
	var gridX = Math.floor(mouseX / squareSize);
	var gridY = Math.floor(mouseY / squareSize);

	sendMessage(gridX, gridY, 1);
}

function dragHandler(e) {
	if(!active || (!mousedown&&!touchdown))
		return;
	e.preventDefault();
	var canvas = document.getElementById("main");
	var mouseX = e.pageX - canvas.offsetLeft;
	var mouseY = e.pageY - canvas.offsetTop;
	
	var gridX = Math.floor(mouseX / squareSize);
	var gridY = Math.floor(mouseY / squareSize);

	sendMessage(gridX, gridY, 1);
}

/**
 * Called to send a message back to Diffusion
 */
function sendMessage(x, y, v) {

	var message = new TopicMessage( topicName+"/games/"+gameName+"/SquareState/"+y, x+"");
	DiffusionClient.sendTopicMessage(message);
}

/**
 * Called when the page is ready: places a connection to Diffusion, put the
 * keyboard focus into the input widget
 */
function onLoad() {
	var canvas = document.getElementById("main");
	canvas.addEventListener('click', mouseHandler, false);
	canvas.addEventListener('mousedown', function() { mousedown = true; }, false);
	canvas.addEventListener('mouseup', function() { mousedown = false; }, false);
	canvas.addEventListener('mousemove', dragHandler, false);
	canvas.addEventListener('touchstart', function() { touchdown = true; }, false);
	canvas.addEventListener('touchend', function() { touchdown = false; }, false);
	canvas.addEventListener('touchmove', dragHandler, false);

	var gameNameElem = document.getElementById('gameName');
	gameName = gameNameElem.value;

	var letters = /^[0-9a-zA-Z]+$/;

	if(letters.test(gameName) || gameName==""){
		active = true;
		
		var gameNameElem = document.getElementById('gameName');
		
		gameName = gameNameElem.value;
		
		gameName = gameName.replace(/^(\s*)|(\s*)$/g, '').replace(/\s+/g, ' ');
		
		if(gameName=="")
			gameName="default";
		
		var credentials = {
			username : gameName,
			password : "",
		};
	
		/* set the credentials to join a game, then subscribe to the relevant topics */
		DiffusionClient.setCredentials(credentials);
		DiffusionClient.sendCredentials(DiffusionClient.getCredentials());
		DiffusionClient.subscribe(topicName);
		DiffusionClient.subscribe(topicName+"/games/"+gameName+"//");
		var register = new TopicMessage( topicName+"/games/"+gameName+"/Players/Register");
		register.addUserHeader("R");
		DiffusionClient.sendTopicMessage(register);
		
		var div = document.getElementById('roomSelect');
		div.parentNode.removeChild(div);
		
		// start drawing!
		processingInstance.loop();
		tickerInstance.loop();
	}
	else {
		$('#inputbox').addClass('input-append control-group error')
					.find('input').attr('placeholder', 'Invalid game name').val("");
		$('#inputbox').find('button').addClass('btn-danger');
		return false;
	}
}

function clickGame(gameName) {
	document.getElementById('gameName').value = gameName;
	onLoad();
}

/**
 * Get a list of currently active games to populate the join game dialog
 */
function activeGames() {
	
	var connectionDetails = {
			topic : topicName+"/games",
			debug : false,
			onDataFunction : gamesMessage,
	};
	
	DiffusionClient.connect(connectionDetails);
	
	window.onbeforeunload = windowClosed;
}

function windowClosed() {
	DiffusionClient.close();
}

function gamesMessage(webClientMessage) {
	
	if(!active) {
		var div=document.getElementById('activeGames');
		div.innerHTML = "";
		
		if(webClientMessage.getRecord(0).getField(0) == ""){
			var node = document.createElement('p');
			var att = document.createAttribute("class");
			att.value = "muted";
			node.setAttributeNode(att);
			node.innerHTML = "<em>None</em>";
			div.appendChild(node);
		}
		else{
			while(webClientMessage.hasRemaining()) {
				var rec = webClientMessage.nextRecord();
				var value = rec.getField(0);
				var nplayers = rec.getField(1);
				var container = document.createElement('p');
				var node = document.createElement('button');
				var att = document.createAttribute("onclick");
				att.value = "javascript: clickGame(\""+value+"\");";
				node.setAttributeNode(att);
				var att2 = document.createAttribute("class");
				att2.value = "btn fixed";
				
				if(nplayers < 6) {
					att2.value += " btn-success";
				}
				else if(nplayers < 10) {
					att2.value += " btn-warning";
				}
				else if(nplayers==10) {
					att2.value += " btn-danger";
				}
				node.setAttributeNode(att2);
				node.innerHTML = value.substring(0,12) + (value.length > 12 ? "..." : "") + "   (" + nplayers + "/10)";
				container.appendChild(node);
				div.appendChild(container);
			}
		}
	}
	else {
		// we are connected to a game now, handle the messages differently
		onDataEvent(webClientMessage);
	}
}
