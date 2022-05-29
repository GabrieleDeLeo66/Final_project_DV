  function Map() {
      
  // The svg
  var svg = d3.select("#map"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoAiry()
  .scale(1000)
  .translate([400, 1140])

  
// Data and color scale
  var data = d3.map();
  var colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

  // Load external data and boot
    d3.queue()
    .defer(d3.json, "/src/asset/europe.geo.json")
    .defer(d3.csv, "/data/owid-covid-data-Europe.csv", function(d) { data.set(d.iso_code, +d.total_cases); })
    .await(ready);


  // Draw the map
  function ready(error, topo) {

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
        // set the color of each country
        .attr("fill", function (d) {
            console.log(d)
          d.total = data.get(d.properties.iso_a3) || 0;
          console.log(d.properties.iso_a3)
          return colorScale(d.total);
        });
  }
}
