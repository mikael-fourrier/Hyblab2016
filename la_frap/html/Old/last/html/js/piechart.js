"use strict";

var globalpie;

window.addEventListener('load',function () {
	
	globalpie = new d3pie("#pieChartSvg", {
		/*"header": {
			"title": {
				"fontSize": 34,
				"font": "courier"
			},
			"subtitle": {
				"text": "Cliquez pour afficher les valeurs",
				"color": "#999999",
				"fontSize": 12,
				"font": "courier"
			},
			"titleSubtitlePadding": 10
		},
		"footer": {
			"color": "#999999",
			"fontSize": 12,
			"font": "open sans",
			"location": "bottom-center"
		},*/
		"size": {
			"canvasWidth": 250,
			"pieInnerRadius": "73%",
			"pieOuterRadius": "66%"
		},
		"data": {
			"sortOrder": "value-desc",
			"content": [
				{
					"label": "Subventions",
					"value": 68,
					"color": "#ff314f",
					"text":"texte sub"
				},
				{
					"label": "Aides à l'emploi",
					"value": 10,
					"color": "#954fd1",
					"text":"texte aide"
				},
				{
					"label": "Publicité",
					"value": 7,
					"color": "#004fa9",
					"text":"texte pub"
				},
				{
					"label": "Evenements et ateliers",
					"value": 2,
					"color": "#3bbd31",
					"text":"texte event"
				},
				{
					"label": "Cotisations et dons ",
					"value": 2,
					"color": "#00c7e5",
					"text":"texte dons"
				},
				{
					"label": "Autre",
					"value": 20,
					"color": "#ff8b1d",
					"text":"texte autre"
				}
			]
		},
		"labels": {
			"outer": {
				"format": "none",
				"pieDistance": 20
			},
			"inner": {
				"format": "none"
			},
			"mainLabel": {
				"fontSize": 11
			},
			"percentage": {
				"color": "#999999",
				"fontSize": 11,
				"decimalPlaces": 0
			},
			"value": {
				"color": "#cccc43",
				"fontSize": 11
			},
			"lines": {
				"enabled": true,
				"color": "#777777"
			},
			"truncation": {
				"enabled": true
			}
		},
		"tooltips": {
			"enabled": true,
			"type": "placeholder",
			"string": "{label}: {value}, {percentage}%",
			"styles": {
				"backgroundOpacity": 0.61
			}
		},
		"effects": {
			"pullOutSegmentOnClick": {
				"effect": "linear",
				"speed": 800,
				"size": 20
			}
		},
		"misc": {
			"colors": {
				"segmentStroke": "#000000"
			}
		},
		"callbacks":{
			onClickSegment: function (info){

				console.log(info);
				var is = d3.select("#infoselected");
				pieData = d3.select('#idPieData');
				pieExplains = d3.select('#pieExplains');
				
				if(!info.expanded) {

					pieData.text((100*info.data.value/globalpie.totalSize).toFixed(0) +'%');
					is.text(info.data.value + "€")
						.attr("fill", "white")
						.attr("font-size","16px")
						.attr("font-weight","bold")
						.attr("y","72%");
					pieExplains.html(info.data.text);
				} else {
					pieData.text("");
					is.text("");
					pieExplains.html("");
				}
			}
		}
	});
	
	var svg = d3.select("#pieChartSvg").select("svg");
	var pieData = svg.append("text")
					.attr("id","idPieData")
					.attr("fill", "white")
					.attr("font-size", "30px")
					.attr("text-anchor", "middle")
					.attr("x", "50%")
					.attr("y", "50%")
					.attr("dx", "0px")
					.attr("dy", "10px");
					
	
	var legendCircleSize = 14;
	var legendSpacing = 8;
	var legendsvg = d3.select("#pieInfo").append('svg')
					.attr('id', 'legendSvg')
					.attr('width', 300)
					.attr('height', 300);
	var legend = legendsvg.selectAll('.legend')
					.data(globalpie.options.data.content)
					.enter()
					.append('g')
					.attr('class', 'legend')
					.attr('transform', function(d, i) {
						var height = legendCircleSize + legendSpacing;
						var horiz = -2*legendCircleSize;
						var vert = 	legendCircleSize + i*height;
						return 'translate('+'0'+','+vert+')';
					});
	
	legend.append('circle')
					.attr('cx', legendCircleSize/2)
					.attr('r', legendCircleSize/2)
					.style('fill', function(d) { return d.color; })
					.style('stroke', function(d) { return d.color; });
	legend.append('text')
					.attr('x', legendCircleSize + legendSpacing)
					.attr('y', legendCircleSize - legendSpacing)
					.attr("fill", "#179fae")
					.attr('font-weight', 'bold')
					.attr("font-size", "14px")
					.text(function(d) { return d.label; });
					 
	var pieClick = svg.append("text")
					.attr("id","infoselected")
					.attr("fill", "#179fae")
					.attr("font-size", "12px")
					.attr("text-anchor", "middle")
					.attr("x", "50%")
					.attr("y", "70%")
					.text("Cliquez pour afficher les valeurs");
					
					
	var pieExplains = d3.select("#pieInfo").append("p")
					.attr("id","pieExplains")
					.style("font-weight", "bold");
	

	/*pie = d3.select("#pieChart").select("svg");
	pie.attr("height",300)*/
	//x = document.getElementsByClassName("p0_pieChart");
	//console.log(x);

	//.setAttribute("transform","scale(1), translate(150,150)");

	
	//document.getElementById("pie").setAttribute("transform","scale(1), translate(0,0)");

});
