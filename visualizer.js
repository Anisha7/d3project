d3.csv("Spotify-2000.csv").then(csv => {
  const data = parseCSV(csv);
  buildSomething(data);
});

// VARIABLES
const radius = window.innerWidth / 2;
const format = d3.format(",d");

const partition = data =>
  d3.partition().size([2 * Math.PI, radius])(
    d3
      .hierarchy(data)
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value)
  );

function autoBox() {
  const { x, y, width, height } = this.getBBox();
  return [x, y, width, height];
}

// BUILD IT
function buildSomething(data) {
  console.log(data);
  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, data.children.length + 1)
  );

  const r = partition(data);
  console.log(r);
  console.log(r.descendants().filter(d => d.depth));
  // const r = data
  const svg = d3
    .select("#svg")
    .style("max-width", "100%")
    .style("height", "auto")
    .style("font", "10px sans-serif")
    .style("margin", "5px");

  const arc = d3
    .arc()
    .startAngle(d => d.x0)
    .endAngle(d => d.x1)
    .padAngle(d => Math.min((d.x1 - d.x0) / 2, 0.005))
    .padRadius(radius / 2)
    .innerRadius(d => d.y0)
    .outerRadius(d => d.y1 - 1);

  svg
    .append("g")
    .attr("fill-opacity", 0.6)
    .selectAll("path")
    .data(r.descendants().filter(d => d.depth))
    .enter()
    .append("path")
    .attr("fill", d => {
      while (d.depth > 1) d = d.parent;
      return color(d.data.name);
    })
    .attr("d", arc)
    .append("title")
    .text(
      d =>
        `${d
          .ancestors()
          .map(d => d.data.name)
          .reverse()
          .join("/")}\n${format(d.value)}`
    );

  svg
    .append("g")
    .attr("pointer-events", "none")
    .attr("text-anchor", "middle")
    .selectAll("text")
    .data(
      r
        .descendants()
        .filter(d => d.depth && ((d.y0 + d.y1) / 2) * (d.x1 - d.x0) > 10)
    )
    .enter()
    .append("text")
    .attr("transform", function(d) {
      const x = (((d.x0 + d.x1) / 2) * 180) / Math.PI;
      const y = (d.y0 + d.y1) / 2;
      return `rotate(${x - 90}) translate(${y},0) rotate(${x < 180 ? 0 : 180})`;
    })
    .attr("dy", "0.35em")
    .text(d => d.data.name);

  svg.attr("viewBox", autoBox);
}
