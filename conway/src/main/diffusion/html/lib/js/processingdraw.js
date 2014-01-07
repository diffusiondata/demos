function draw(processing) {
	processing.draw = function() {
		
		processing.beginDraw();
		processing.noStroke();
		
		var sizeDiff = processing.sin(processing.frameCount / 3.0);
		var colourDiff = 0;

		//processing.stroke(0);
		for (var x=0;x<gridSize;x++)
		{
			for (var y=0;y<gridSize;y++)
			{
				var r = 5+((gridSize-x)/6.0)+((gridSize-y)/4.0);
				var g = 5+((gridSize-x)/5.0)+((y)/5.0);
				var b = 5+((x)/4.0)+((gridSize-y)/6.0);
				if(x%2==0)
					r+=15;
				if(y%2==0)
					g+=8;
				processing.fill(r,g,b);
				processing.rect((x*squareSize), (y*squareSize), squareSize, squareSize);
			}
		}
		for(var i=0; i<10; i++) {
			processing.ellipseMode(processing.CORNER);
			for (var x=0;x<gridSize;x++)
			{
				for (var y=0;y<gridSize;y++)
				{
					if(gridState[x][y] == (i+1)) {

						var r = Math.min(Math.max(hexToRgb(colours[i]).r + colourDiff, 0),255);
						var g = Math.min(Math.max(hexToRgb(colours[i]).g + colourDiff, 0),255);
						var b = Math.min(Math.max(hexToRgb(colours[i]).b + colourDiff, 0),255);
						processing.fill(r,g,b);
						processing.ellipse((x*squareSize)-(sizeDiff/2.)-1, (y*squareSize)-(sizeDiff/2.)-1, squareSize+sizeDiff+2, squareSize+sizeDiff+2);
					}
				}
			}
		}
		processing.endDraw();
	}
	//processing.noLoop();
}

function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

var canvas = document.getElementById("main");
var processingInstance = new Processing(canvas, draw);
processingInstance.frameRate(15);
processingInstance.size(res,res);
processingInstance.draw();
processingInstance.noLoop();