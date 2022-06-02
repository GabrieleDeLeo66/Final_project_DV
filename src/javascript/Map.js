  function Map() {
      
  // The svg
  var svg = d3.select("#map").append("svg").attr("id","main")
  width = +svg.attr("width"),
  height = +svg.attr("height");

  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoAiry()
  .scale(1150)
  .translate([400, 1320]);

  
// Data and color scale
  var temperatures = []
  for (var i = 36; i < 42.1 ; i = i + 0.1) {
    temperatures.push(i) 
  } 
  console.log(temperatures)
  var data = d3.map();
  var colorScale = d3.scaleLinear()
  .domain([36,42])
  .range(["white","red"])


  // Load external data and boot
    d3.queue()
    .defer(d3.json, "/src/asset/europe.geo.json")
    .defer(d3.csv, "/data/owid-covid-data-Europe.csv", function(d) { data.set(d.iso_code,+d.new_cases); })
    .await(ready);

    d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .attr('style', 'position: absolute; opacity: 0;');



  // Draw the map
  function ready(error, topo) {

    console.log(data)
    var  mouseOver = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", .2)
        d3.select(this)
          .transition()
          .duration(200)
          .style("opacity", 1)

          d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d)

      }
    
      var mouseLeave = function(d) {
        d3.selectAll(".Country")
          .transition()
          .duration(200)
          .style("opacity", 1)
        d3.select(this)
          .transition()
          .duration(200)
          .style("stroke", "white")

          d3.select('#tooltip').style('opacity', 0)
      }


    // Draw the map
    svg.append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
        // draw each country
        .attr("d", d3.geoPath()
          .projection(projection)
        )
        .style("stroke","white")
        // set the color of each country
        .attr("fill", function (d) {
          d.total = data.get(d.properties.iso_a3) || 0;
          console.log(d.properties.geounit)
          var fever = (Math.log((d.total/1000)+1)+36.5)
          console.log(fever)
          return colorScale(fever);
        })
        .attr("class", function(d){ return "Country" } )
        .on("mouseover", mouseOver = function(d) {
            d3.selectAll(".Country")
              .transition()
              .duration(200)
              .style("opacity", .2)
            d3.select(this)
              .transition()
              .duration(200)
              .style("opacity", 1)
    
              d3.select('#tooltip').transition().duration(200).style('opacity', 1).text(d.properties.geounit)
    
          })
        .on("mouseleave", mouseLeave )
        .on('mousemove', function() {
            d3.select('#tooltip')
            .style('left', (d3.event.pageX+10) + 'px')
            .style('top', (d3.event.pageY+10) + 'px')
            })
        

  }
}
