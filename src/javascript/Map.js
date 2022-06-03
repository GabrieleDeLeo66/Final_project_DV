function Map() {
  // The svg
  var svg = d3.select("#map").append("svg").attr("id", "main");
  (width = +svg.attr("width","1000px")), (height = +svg.attr("height","1000px"));

  // Map and projection
  var path = d3.geoPath();
  var projection = d3.geoAiry().scale(1150).translate([400, 1320]);

  // Data and color scale
  var temperatures = [];
  for (var i = 36; i < 42.1; i = i + 0.1) {
    temperatures.push(i);
  }
  console.log(temperatures);
  var data = d3.map();
  var colorScale = d3.scaleLinear().domain([36, 42]).range(["white", "red"]);

  // Load external data and boot
  d3.queue()
    .defer(d3.json, "/src/asset/europe.geo.json")
    .defer(d3.csv, "/data/owid-covid-data-Europe.csv", function (d) {
      data.set(d.iso_code, +d.new_cases);
    })
    .await(ready);

  d3.select("#map")
    .append("input")
    .attr("type","date")
    .attr("id","date")
    .attr("value","1997-01-07")
    .attr("style","position:absolute;top:350px;left:50px;font-family:Montserrat;font-size:large;background-color:#4C4949;color:#fff;")

  d3.select("body")
    .append("div")
    .attr("id", "tooltip")
    .attr(
      "style",
      "position: absolute; opacity: 0; width: 170px;background-color: #4C4949;color: #fff;text-align: center;padding: 5px 0;border-radius: 6px;font-family: Montserrat;"
    );

  // Draw the map
  function ready(error, topo) {
    console.log(data);

    function arrotondaNumero(numero, nDecimali) {
      var numero_arrotondato =
        Math.round(numero * Math.pow(10, nDecimali)) / Math.pow(10, nDecimali);

      return numero_arrotondato;
    }

    var mouseLeave = function (d) {
      d3.selectAll(".Country").transition().duration(200).style("opacity", 1);
      d3.select(this).transition().duration(200).style("stroke", "white");

      d3.select("#tooltip").transition().duration(100).style("opacity", 0);
    };

    // Draw the map
    svg
      .append("g")
      .selectAll("path")
      .data(topo.features)
      .enter()
      .append("path")
      // draw each country
      .attr("d", d3.geoPath().projection(projection))
      .style("stroke", "white")
      // set the color of each country
      .attr("fill", function (d) {
        d.total = data.get(d.properties.iso_a3) || 0;
        console.log(d.properties.geounit);
        var fever = Math.log(d.total / 1000 + 1) + 36.5;
        console.log(fever);
        return colorScale(fever);
      })
      .attr("class", function (d) {
        return "Country";
      })
      .on(
        "mouseover",
        (mouseOver = function (d) {
          d3.selectAll(".Country")
            .transition()
            .duration(200)
            .style("opacity", 0.2);
          d3.select(this).transition().duration(200).style("opacity", 1);

          d3.select("#tooltip")
            .html(
              d.properties.geounit +
                "<br>New cases: " +
                d.total +
                "<br>Fever: " +
                arrotondaNumero(Math.log(d.total / 1000 + 1) + 36.5, 1) +
                "&degC"
            )
            .transition()
            .duration(100)
            .style("opacity", 1);
        })
      )
      .on("mouseleave", mouseLeave)
      .on("mousemove", function () {
        d3.select("#tooltip")
          .style("left", d3.event.pageX + 10 + "px")
          .style("top", d3.event.pageY + 10 + "px");
      });
  }
}
