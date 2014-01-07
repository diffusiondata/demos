var full = false;
var switched = false;

function draw(processing) {
	processing.draw = function() {
		
		processing.beginDraw();

		processing.background(0);
		processing.noStroke();
		processing.fill(0,0,150);
		for(var x=0; x<pieSlice-1; x++) {
			processing.rect((x*33),5,33,33);
		}
		processing.endDraw();
	}
	processing.noLoop();
}

var ticker = document.getElementById("counter");
var tickerInstance = new Processing(ticker, draw);
tickerInstance.frameRate(4);
tickerInstance.size(140,50);
tickerInstance.draw();
tickerInstance.noLoop();
