function loadHBar(data){
    //sample json data below:
	//var data = [{label:"Y",value: 10, color: "#dff0d8"},
	//			{label:"N",value: 1000, color: "#f2dedf"}];


	//get largest value in json object
	var largest = Math.max.apply(null, data.map(function(item) { return item["value"]; }))
	var barWidth = adjustBar(largest);
    var barHeight = 20;
    var duration = 500;
    var delay = 100;
	// set up bar dimensions
	var x = d3.scale.linear()
    .domain([0, adjustBar(largest)])
    .range([0, barWidth]);
	//build SVG container inside a div with class hbarchart		 
	var svgContainer = d3.select(".hbarchart")
										 .append("svg")		//add the svg html tag
										 .attr("width", barWidth * 10) //adding attributes to svg tag
										 .attr("height", barHeight * 2.5)
										 .attr("id", "bizRulesChart");

	//building and adding bars to SVG container									 
	var bar = svgContainer.selectAll("g")
						  .data(data)
						  .enter()
						  .append("g")
						  .attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; });

	// Bar labels
	 bar.append("text")
    .attr("x", 0)
    .attr("y", 0)
    .transition()
        .delay(function(d, i) { return i * delay ;})
        .duration(duration)
        .attr("x", 0)
        .attr("y", barHeight / 2)
        .attr("dy", ".35em")
        .text(function(d) { return d.label; });
    //Bar positions
	bar.append("rect")
	.attr("x", 0)
    .attr("width", 0)
    .attr("height", 0)
    .style("fill", function(d) { return d.color; })
    .style("stroke", "#B6B6B4")
    .transition()
        .delay(function(d, i) { return i * delay ;})
        .duration(duration)
	    .attr("x", 75)
        .attr("width", function(d) { return x(adjustBar(d.value)); })
        .attr("height", barHeight - 1)
	// Totals at end of bar
	bar.append("text")
    .attr("x", function(d) { return 75 + x(adjustBar(d.value)); })
    .attr("y", barHeight / 2)
    .attr("dy", ".35em")
    .text(function(d) { return d.value; });

    					  					
    
}

function adjustBar(barWidth){
    var newBarWidth = barWidth;
    if (barWidth >= 6000){
        newBarWidth = barWidth / 10;
    } else if (barWidth <= 4000 && barWidth >= 2000 ){
        newBarWidth = barWidth / 7;
    } else if (barWidth < 2000 && barWidth >= 1000){
        newBarWidth = barWidth / 6
    } else if (barWidth < 1000 && barWidth >= 800) {
        newBarWidth = barWidth / 4;
    } else if (barWidth < 800 && barWidth >= 200){
        newBarWidth = barWidth / 2;
    } else if (barWidth < 20)
        newBarWidth = barWidth * 10;
    return newBarWidth;
}

function loadDoughnut(data){
    //sample json data
	//var data = [{label:"2015 EMA New England PGA",value: 53},
	//			{label:"2015 EMA New Jersey PGA",value: 19},
	//			{label:"2015 GLMA 105F", value:44}];

	//set up doughnut chart dimensions
	var width = 960;
    var height = 500;
    var radius = Math.min(width, height) / 2;
    var doughWidth = 100;
    var duration = 500;
    var delay = 100;

	//set up doughnut chart color scheme
	var color = d3.scale.category20();

	//set up svg container and main d3 logic
	var svg = d3.select('.doughChart')
		.append('svg')
		.attr('width', width)
		.attr('height', height)
		.append('g')
		.attr('transform', 'translate(' + (width / 2) +
            ',' + (height / 2) + ')');

    //set up length of arc
    var arc = d3.svg.arc()
  		.innerRadius(radius - doughWidth)
  		.outerRadius(radius);
    //set up pie layout
    var pie = d3.layout.pie()
          .value(function(d) { return d.event_totals; })
          .sort(null);

    //draw out the sections and assemble the pie
    var g = svg.selectAll(".arc")
      .data(pie(data))
      .enter().append("g")
      .attr("class", "arc");
    g.append("path")
      .attr("d", 0)
      .style("fill", 'white')
      .transition()
        .delay(function(d, i) { return i * delay ;})
        .duration(500)
        .attr("d", arc)
        .style("fill", function(d) { return color(d.data.event_name); });
    g.append("text")
      .transition()
        .duration(duration)
        .delay(function(d,i) { return i * delay})
        .attr("transform", function(d) { return "translate(" + arc.centroid(d) + ")"; })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .text(function(d) { return d.data.event_totals; });

   //create the left key legend
   var legendRectSize = 18;
   var legendSpacing = 4;

   var legend = svg.selectAll('.legend')
  	.data(pie(data))
  	.enter()
  	.append('g')
  	.attr('class', 'h6')
  	.attr('transform', function(d, i) {
      var height = legendRectSize + legendSpacing;
      var offset =  height * color.domain().length / 2;
      var horz = -27 * legendRectSize;
      var vert = i * height - offset;
      return 'translate(' + horz + ',' + vert + ')';
      });

  legend.append('rect')
  .attr('width', 0)
  .attr('height', 0)
  .style("fill", function(d) { return color(d.data.event_name); })
  .style('stroke', function(d) { return color(d.data.event_name); })
  .transition()
    .delay(function(d,i) { return i * delay ; })
    .duration(duration)
    .attr('width', legendRectSize)
    .attr('height', legendRectSize)
    .style("fill", function(d) { return color(d.data.event_name); })
    .style('stroke', function(d) { return color(d.data.event_name); })

  //Load key legend text
  legend.append('text')
  .data(data)
  .attr('x', 0)
  .attr('y', 0)
  .transition()
    .delay(function(d, i) { return i * delay})
    .duration(duration)
    .attr('x', legendRectSize + legendSpacing)
    .attr('y', legendRectSize - legendSpacing)
    .text(function(d) { return d.event_name; });

}
