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
  const color = d3.scaleOrdinal(
    d3.quantize(d3.interpolateRainbow, data.children.length + 1)
  );

  const r = partition(data);
  const svg = d3
    .select("#svg")
    .style("max-width", "100%")
    .style("height", "auto")
    .style("font", "18px sans-serif")
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
    .append("g") // g:a
    // .attr("xlink:href", "http://en.wikipedia.org/", '_blank')
    .attr("fill-opacity", 0.6)
    .selectAll("path")
    .data(r.descendants().filter(d => d.depth))
    .enter()
    .append("path")
    .style("cursor", d => d.depth > 2 ? "pointer" : "default")
    .on('click', function(d) {
        if (d.depth > 2) {
            window.open(
              `https://www.youtube.com/results?search_query=${d.data.name}`, // update link
              '_blank' 
            );
        }
      })
    .attr("fill", d => {
      const depth = d.depth
      while (d.depth > 1) d = d.parent;
      return d3.rgb(color(d.data.name)).brighter(depth)
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
    )
    // tried to make text links underline on hover
    // .classed("linked", d => d.depth > 2 ? true : false)
    // .on('hover', d => {
    //     if (d.depth > 2) { 
    //         d3.select(this).style("color", "blue"); 
    //     }
    // });

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
