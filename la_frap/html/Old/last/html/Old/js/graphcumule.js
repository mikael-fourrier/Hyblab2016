"use strict";
var cumul = function cumule (){

				var m = [20, 20, 30, 20],
			    w = 400 +100,
			    h = 400 - m[0] - m[2];

			var x,
			    y,
			    duration = 1500,
			    delay = 500;

			var color = ["#ff314f","#ff8b1d","#00c7e5","#004fa9","#954fd1"];
			var i = 0;

			var svg = d3.select("#financement").append("svg")
			    .attr("width", w + 100)
			    .attr("height", h + 150)
			  	.append("g")
			    .attr("transform", "translate(" + m[3] + "," + m[0] + ")")
			    .attr("id","svgcumule");

			var stocks,
			    provenances;

			// A line generator, for the dark stroke.
			var line = d3.svg.line()
			    .interpolate("linear")
			    .x(function(d) { return x(d.date); })
			    .y(function(d) { return y(d.subvention); });

			// A line generator, for the dark stroke.
			var axis = d3.svg.line()
			    .interpolate("linear")
			    .x(function(d) { return x(d.date); })
			    .y(h);

			// A area generator, for the dark stroke.
			var area = d3.svg.area()
			    .interpolate("linear")
			    .x(function(d) { return x(d.date); })
			    .y1(function(d) { return y(d.subvention); });

			d3.csv("data.csv", function(data) {
			  var parse = d3.time.format("%b %Y").parse;

			  // Nest stock values by provenance.
			  provenances = d3.nest()
			      .key(function(d) { return d.provenance; })
			      .entries(stocks = data);

			  // Parse dates and numbers. We assume values are sorted by date.
			  // Also compute the maximum subvention per provenance, needed for the y-domain.
			  provenances.forEach(function(s) {
			    s.values.forEach(function(d) { d.date = parse(d.date); d.subvention = +d.subvention; });
			    s.maxsubvention = d3.max(s.values, function(d) { return d.subvention; });
			    s.sumsubvention = d3.sum(s.values, function(d) { return d.subvention; });
			  });

			  // Sort by minimum subvention, ascending.
			  provenances.sort(function(a, b) { return a.minsubvention - b.minsubvention; });

			  var g = svg.selectAll("g")
			      .data(provenances)
			    .enter().append("g")
			      .attr("class", "provenance");

			  setTimeout(lines, duration+delay);
			});

			function lines() {
			  x = d3.time.scale().range([0, w - 60]);
			  y = d3.scale.linear().range([h / 4 - 20, 0]);

			  // Compute the minimum and maximum date across provenances.
			  x.domain([
			    d3.min(provenances, function(d) { return d.values[0].date; }),
			    d3.max(provenances, function(d) { return d.values[d.values.length - 1].date; })
			  ]);

			  var g = svg.selectAll(".provenance")
			      .attr("transform", function(d, i) { return "translate(0," + (i * h / 4 + 10) + ")"; });

			  g.each(function(d) {
			    var e = d3.select(this);

			    e.append("path")
			        .attr("class", "line");

			    e.append("circle")
			        .attr("r", 5)
			        .style("fill", function() { i = (i+1)%5 ; return color[i]; })
			        .style("stroke", "#000")
			        .style("stroke-width", "2px");

			    e.append("text")
			        .attr("x", 12)
			        .attr("dy", ".31em")
			        .text(d.key);
			  });

			  function draw(k) {
			    g.each(function(d) {
			      var e = d3.select(this);
			      y.domain([0, d.maxsubvention]);

			      e.select("path")
			          .attr("d", function(d) { return line(d.values.slice(0, k + 1)); });

			      e.selectAll("circle, text")
			          .data(function(d) { return [d.values[k], d.values[k]]; })
			          .attr("transform", function(d) { return "translate(" + x(d.date) + "," + y(d.subvention) + ")"; });
			    });
			  }

			  var k = 1, n = provenances[0].values.length;
			  d3.timer(function() {
			    draw(k);
			    if ((k += 2) >= n - 1) {
			      draw(n - 1);
			      setTimeout(horizons, 500);
			      return true;
			    }
			  });
			}

			function horizons() {
			  svg.insert("defs", ".provenance")
			    .append("clipPath")
			      .attr("id", "clip")
			    .append("rect")
			      .attr("width", w+100)
			      .attr("height", h / 4 - 20);

			  
			var color = ["#ff314f","#ff8b1d","#00c7e5","#004fa9","#954fd1"];

			  var g = svg.selectAll(".provenance")
			      .attr("clip-path", "url(#clip)");

			  area
			      .y0(h / 4 - 20);

			  g.select("circle").transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (-h / 4) + ")"; })
			      .remove();

			  g.select("text").transition()
			      .duration(duration)
			      .attr("transform", function(d) { return "translate(" + (w - 60) + "," + (h / 4 - 20) + ")"; })
			      .attr("dy", "0em");

			  g.each(function(d) {
			    y.domain([0, d.maxsubvention]);

			    d3.select(this).selectAll(".area")
			        .data(d3.range(3))
			      .enter().insert("path", ".line")
			        .attr("class", "area")
			        .attr("transform", function(d) { return "translate(0," + (d * (h / 4 - 20)) + ")"; })
			        .attr("d", area(d.values))
			        .style("fill", function(d, i) { i= (i+1)%5; return color[i]; })
			        .style("fill-opacity", 1e-6);

			    y.domain([0, d.maxsubvention / 3]);

			    d3.select(this).selectAll(".line").transition()
			        .duration(duration)
			        .attr("d", line(d.values))
			        .style("stroke-opacity", 1e-6);

			    d3.select(this).selectAll(".area").transition()
			        .duration(duration)
			        .style("fill-opacity", 1)
			        .attr("d", area(d.values))
			        .each("end", function() { d3.select(this).style("fill-opacity", null); });
			  });

			  setTimeout(areas, duration + delay);
			}

			function areas() {
			  var g = svg.selectAll(".provenance");

			  axis
			      .y(h / 4 - 21);

			  g.select(".line")
			      .attr("d", function(d) { return axis(d.values); });

			  g.each(function(d) {
			    y.domain([0, d.maxsubvention]);

			    d3.select(this).select(".line").transition()
			        .duration(duration)
			        .style("stroke-opacity", 1)
			        .each("end", function() { d3.select(this).style("stroke-opacity", null); });

			    d3.select(this).selectAll(".area")
			        .filter(function(d, i) { return i; })
			      .transition()
			        .duration(duration)
			        .style("fill-opacity", 1e-6)
			        .attr("d", area(d.values))
			        .remove();

			    i = (i+1)%5;

			    d3.select(this).selectAll(".area")
			        .filter(function(d, i) { return !i; })
			      .transition()
			        .duration(duration)
			        .style("fill", color[i])
			        .attr("d", area(d.values));
			  });

			  svg.select("defs").transition()
			      .duration(duration)
			      .remove();

			  g.transition()
			      .duration(duration)
			      .each("end", function() { d3.select(this).attr("clip-path", null); });

			  setTimeout(stackedArea, duration + delay);
			}

			function stackedArea() {
			  var stack = d3.layout.stack()
			      .values(function(d) { return d.values; })
			      .x(function(d) { return d.date; })
			      .y(function(d) { return d.subvention; })
			      .out(function(d, y0, y) { d.subvention0 = y0; })
			      .order("reverse");

			  stack(provenances);

			  y
			      .domain([0, d3.max(provenances[0].values.map(function(d) { return d.subvention + d.subvention0; }))])
			      .range([h, 0]);

			  line
			      .y(function(d) { return y(d.subvention0); });

			  area
			      .y0(function(d) { return y(d.subvention0); })
			      .y1(function(d) { return y(d.subvention0 + d.subvention); });

			  var t = svg.selectAll(".provenance").transition()
			      .duration(duration)
			      .attr("transform", "translate(0,0)")
			      .each("end", function() { d3.select(this).attr("transform", null); });

			  t.select("path.area")
			      .attr("d", function(d) { return area(d.values); });

			  t.select("path.line")
			      .style("stroke-opacity", function(d, i) { return i < 3 ? 1e-6 : 1; })
			      .attr("d", function(d) { return line(d.values); });

			  t.select("text")
			      .attr("transform", function(d) { d = d.values[d.values.length - 1]; return "translate(" + (w - 60) + "," + y(d.subvention / 2 + d.subvention0) + ")"; });

			  setTimeout(function() {
			    svg.selectAll("g").data(provenances).enter().append("g").attr("class", "provenance");
			  }, duration);
			}}