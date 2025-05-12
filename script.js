// script.js

const width = 1000;
const height = 600;

const svg = d3.select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const projection = d3.geoNaturalEarth1()
  .scale(170)
  .translate([width / 2, height / 2]);

const path = d3.geoPath().projection(projection);

const tooltip = d3.select("#tooltip");

// Load world map and meteorite data
Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
]).then(([worldData, meteorData]) => {

  const countries = topojson.feature(worldData, worldData.objects.countries);

  svg.append("g")
    .selectAll("path")
    .data(countries.features)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#ccc")
    .attr("stroke", "#333");

  const meteorites = meteorData.features.filter(d => d.geometry);

  const massExtent = d3.extent(meteorites, d => +d.properties.mass);

  const radiusScale = d3.scaleSqrt()
    .domain(massExtent)
    .range([1, 25]);

  svg.append("g")
    .selectAll("circle")
    .data(meteorites)
    .enter()
    .append("circle")
    .attr("cx", d => projection(d.geometry.coordinates)[0])
    .attr("cy", d => projection(d.geometry.coordinates)[1])
    .attr("r", d => radiusScale(+d.properties.mass))
    .on("mouseover", function (event, d) {
      const [x, y] = d3.pointer(event);
      tooltip
        .style("left", x + 20 + "px")
        .style("top", y + "px")
        .html(`
          <strong>${d.properties.name}</strong><br/>
          Mass: ${d.properties.mass || "N/A"} g<br/>
          Year: ${d.properties.year ? new Date(d.properties.year).getFullYear() : "Unknown"}<br/>
          Location: [${d.geometry.coordinates[1].toFixed(2)}, ${d.geometry.coordinates[0].toFixed(2)}]
        `)
        .classed("hidden", false);
    })
    .on("mouseout", () => tooltip.classed("hidden", true));

});
