// script.js

const width = 1000;
const height = 600;

const svg = d3
  .select("#map")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

const g = svg.append("g");

const tooltip = d3.select("#tooltip");

const projection = d3.geoNaturalEarth1().scale(170).translate([width / 2, height / 2]);
const path = d3.geoPath().projection(projection);

// Zoom behavior
const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", (event) => {
  g.attr("transform", event.transform);
});
svg.call(zoom);

// Zoom buttons
const zoomControls = d3.select("#map")
  .append("div")
  .attr("id", "zoom-controls")
  .style("position", "absolute")
  .style("top", "10px")
  .style("left", "10px")
  .style("background", "#fff")
  .style("border", "1px solid #ccc")
  .style("border-radius", "4px")
  .style("box-shadow", "0 1px 4px rgba(0,0,0,0.2)")
  .style("z-index", 10);

zoomControls.append("button").text("+").style("display", "block").style("width", "30px").on("click", () => svg.transition().call(zoom.scaleBy, 1.5));
zoomControls.append("button").text("−").style("display", "block").style("width", "30px").on("click", () => svg.transition().call(zoom.scaleBy, 1 / 1.5));

// Load both datasets
Promise.all([
  d3.json("https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json"),
  d3.json("https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json")
]).then(([worldData, meteoriteData]) => {
  const countries = topojson.feature(worldData, worldData.objects.countries).features;

  g.selectAll("path")
    .data(countries)
    .enter()
    .append("path")
    .attr("d", path)
    .attr("fill", "#d3d3d3")
    .attr("stroke", "#fff");

  let meteorites = meteoriteData.features.filter(d => d.geometry && d.properties.mass);

  const massScale = d3.scaleSqrt()
    .domain([0, d3.max(meteorites, d => +d.properties.mass)])
    .range([0, 20]);

  function updateCircles() {
    const yearInput = document.getElementById("yearRange");
    const yearLabel = document.getElementById("yearLabel");
    const massInput = document.getElementById("massThreshold");

    const yearLimit = yearInput ? +yearInput.value : 2020;
    const massLimit = massInput ? +massInput.value : 0;

    if (yearLabel) yearLabel.textContent = yearLimit;

    const filtered = meteorites.filter(d => {
      const year = new Date(d.properties.year).getFullYear();
      return year <= yearLimit && +d.properties.mass >= massLimit;
    });

    console.log("Rendering meteorites:", filtered.length);

    const circles = g.selectAll("circle").data(filtered, d => d.id);

    circles.enter()
      .append("circle")
      .attr("cx", d => projection(d.geometry.coordinates)[0])
      .attr("cy", d => projection(d.geometry.coordinates)[1])
      .attr("r", d => massScale(+d.properties.mass))
      .attr("fill", "rgba(255, 0, 0, 0.6)")
      .attr("stroke", "#900")
      .on("mouseover", (event, d) => {
        const { name, year, mass, reclat, reclong } = d.properties;
        tooltip
          .style("left", event.pageX + 10 + "px")
          .style("top", event.pageY - 28 + "px")
          .classed("hidden", false)
          .html(
            `<strong>${name}</strong><br/>` +
              `Mass: ${mass} g<br/>` +
              `Year: ${new Date(year).getFullYear()}<br/>` +
              `Lat: ${reclat}, Lon: ${reclong}`
          );
      })
      .on("mouseout", () => tooltip.classed("hidden", true))
      .merge(circles)
      .attr("r", d => massScale(+d.properties.mass))
      .attr("cx", d => projection(d.geometry.coordinates)[0])
      .attr("cy", d => projection(d.geometry.coordinates)[1]);

    circles.exit().remove();
  }

  // Initial render
  updateCircles();

  // Add listeners
  const yearInput = document.getElementById("yearRange");
  const massInput = document.getElementById("massThreshold");

  if (yearInput) yearInput.addEventListener("input", updateCircles);
  if (massInput) massInput.addEventListener("input", updateCircles);

  // Add styled legend with background and description
  const legend = svg.append("g").attr("id", "legend").attr("transform", "translate(20, 370)");

  legend.append("rect")
    .attr("width", 180)
    .attr("height", 150)
    .attr("fill", "#f9f9f9")
    .attr("stroke", "#ccc")
    .attr("rx", 10)
    .attr("ry", 10);

  legend.append("text")
    .attr("x", 10)
    .attr("y", 20)
    .text("Meteorite Mass Legend")
    .attr("font-size", "14px")
    .attr("font-weight", "bold");

  legend.append("text")
    .attr("x", 10)
    .attr("y", 35)
    .text("(Circle size = mass in grams)")
    .attr("font-size", "12px")
    .attr("fill", "#555");

  const legendSizes = [10, 1000, 10000, 100000];

  legendSizes.forEach((mass, i) => {
    const y = i * 25 + 50;
    legend.append("circle")
      .attr("cx", 30)
      .attr("cy", y)
      .attr("r", massScale(mass))
      .attr("fill", "rgba(255, 0, 0, 0.6)")
      .attr("stroke", "#900");

    legend.append("text")
      .attr("x", 60)
      .attr("y", y + 4)
      .text(mass + "g")
      .attr("font-size", "12px")
      .attr("fill", "#333");
  });
});
