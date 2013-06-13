/* 
	Copyright 2013 Push Technology Ltd

	Licensed under the Apache License, Version 2.0 (the "License");
	you may not use this file except in compliance with the License.
	You may obtain a copy of the License at

    	http://www.apache.org/licenses/LICENSE-2.0

	Unless required by applicable law or agreed to in writing, software
	distributed under the License is distributed on an "AS IS" BASIS,
	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
	See the License for the specific language governing permissions and
	limitations under the License.

*/

function Chart() {
	var n = 20, // number of layers
    m = 200, // number of samples per layer
    data0 = d3.layout.stack().offset("wiggle")(this.stream_layers(n, m)),
    data1 = d3.layout.stack().offset("wiggle")(this.stream_layers(n, m)),
    color = d3.interpolateRgb("#aad", "#556");

	var w = 960,
    h = 500,
    mx = m - 1,
    my = d3.max(data0.concat(data1), function(d) {
      return d3.max(d, function(d) {
        return d.y0 + d.y;
      });
    });

var area = d3.svg.area()
    .x(function(d) { return d.x * w / mx; })
    .y0(function(d) { return h - d.y0 * h / my; })
    .y1(function(d) { return h - (d.y + d.y0) * h / my; });

	this.vis = d3.select("#chart-container").append("svg").attr("width", w).attr("height", h);
console.log( data0 );
	vis.selectAll("path").data( data0 ).enter().append("path").style("fill", function() { return color(Math.random()); }).attr("d", area);
}

Chart.prototype.update = function() {

}

Chart.prototype.transition = function() {
  d3.selectAll("path")
	  .data(function() {
		var d = data1;
		this.data1 = this.data0;
		return data0 = d;
	  })
	.transition()
	  .duration(2500)
	  .attr("d", this.area);
}

Chart.prototype.stream_layers = function(n, m, o) {
  //if (arguments.length < 3) o = 0;
  var o = o || 0;
  
  var bump = function (a) {
    var x = 1 / (.1 + Math.random()),
        y = 2 * Math.random() - .5,
        z = 10 / (.1 + Math.random());
		for (var i = 0; i < m; i++) {
		  var w = (i / m - y) * z;
		  a[i] += x * Math.exp(-w * w);
		}
  }
  
  var stream_index = function(d, i) {
	  return {x: i, y: Math.max(0, d)};
	};
	
  return d3.range(n).map(function() {
      var a = [], i;
      for (i = 0; i < m; i++) a[i] = o + o * Math.random();
      for (i = 0; i < 5; i++) bump(a);
      return a.map( stream_index );
    });
}








