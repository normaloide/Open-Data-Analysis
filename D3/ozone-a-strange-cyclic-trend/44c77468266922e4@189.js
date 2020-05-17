// https://observablehq.com/@elle/ozone-a-strange-cyclic-trend@189
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["testO3.json",new URL("./files/bb5f40dc8ae9c0435e9684f280da3f5f2d52ce4f69fa508aa2064232975ab4d71b83453c491f076131ed1ffcd9787a87655a1a8583b899391c818390514062a9",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md
`# Ozone: a Strange Cyclic Trend

## Graph Information
A zoomable icicle graph. The zoom function helps with the significant size of the dataset, while the icicle form creates an intuitive understanding of the aggregate amount of pollution for each year or month. In addition, zoomed-out levels of the hierarchical tree form rag plot-like visualizations which help see periodic trends in the data. This visualization emphasizes sheer quantity over the structure of the data.

## The Case of Ozone
Ozone in Milan showed very little yearly variation until the 2013-2015 period, when it plummeted by almost 10,000 and stopped changing significantly again. Notably however, there is a decisive yearly cyclic nature to ozone presence in the air, increasing in the central (hotter) months of the year and decreasing in the outer (colder) ones. This trend is very visible every year, while zooming on each year or month shows that daily concentrations are extremely stable and rarely fluctuate, unlike other pollutants like PM10 (see other notebook) which can experience extreme swings even in the same month.
`
)});
  main.variable(observer("chart")).define("chart", ["partition","data","d3","width","height","color","format"], function(partition,data,d3,width,height,color,format)
{
  const root = partition(data);
  let focus = root;

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "10px sans-serif");

  const cell = svg
    .selectAll("g")
    .data(root.descendants())
    .join("g")
      .attr("transform", d => `translate(${d.y0},${d.x0})`);  
  
  const rect = cell.append("rect")
      .attr("width", d => d.y1 - d.y0 - 1)
      .attr("height", d => rectHeight(d))
      .attr("fill-opacity", 0.45)                // default was 0.6
      .attr("fill", d => {
        if (!d.depth) return "#ccc";
        while (d.depth > 1) d = d.parent;
        return color(d.data.name);
      })
      .style("cursor", "pointer")
      .on("click", clicked);

  const text = cell.append("text")
      .style("user-select", "none")
      .attr("pointer-events", "none")
      .attr("x", 4)
      .attr("y", 13)
      .attr("fill-opacity", d => +labelVisible(d));

  text.append("tspan")
      .text(d => d.data.name);

  const tspan = text.append("tspan")
      .attr("fill-opacity", d => labelVisible(d) * 0.7)
      .text(d => ` ${format(d.value)}`);

  cell.append("title")
      .text(d => `${d.ancestors().map(d => d.data.name).reverse().join("/")}\n${format(d.value)}`);

  function clicked(p) {
    focus = focus === p ? p = p.parent : p;

    root.each(d => d.target = {
      x0: (d.x0 - p.x0) / (p.x1 - p.x0) * height,
      x1: (d.x1 - p.x0) / (p.x1 - p.x0) * height,
      y0: d.y0 - p.y0,
      y1: d.y1 - p.y0
    });

    const t = cell.transition().duration(750)
        .attr("transform", d => `translate(${d.target.y0},${d.target.x0})`);

    rect.transition(t).attr("height", d => rectHeight(d.target));
    text.transition(t).attr("fill-opacity", d => +labelVisible(d.target));
    tspan.transition(t).attr("fill-opacity", d => labelVisible(d.target) * 0.7);
  }
  
  function rectHeight(d) {
    return d.x1 - d.x0 - Math.min(1, (d.x1 - d.x0) / 2);
  }

  function labelVisible(d) {
    return d.y1 <= width && d.y0 >= 0 && d.x1 - d.x0 > 16;
  }
  
  return svg.node();
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("testO3.json").json()
)});
  main.variable(observer("partition")).define("partition", ["d3","height","width"], function(d3,height,width){return(
data => {
  const root = d3.hierarchy(data)
      .sum(d => d.value)
      /*.sort((a, b) => b.height - a.height || b.value - a.value)*/;  // orders by amount instead of json order
  return d3.partition()
      .size([height, (root.height + 1) * width / 3])
    (root);
}
)});
  main.variable(observer("color")).define("color", ["d3","data"], function(d3,data){return(
d3.scaleOrdinal(d3.quantize(d3.interpolateSinebow, data.children.length + 1))
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(",.2f")
)});
  main.variable(observer("width")).define("width", function(){return(
900
)});
  main.variable(observer("height")).define("height", function(){return(
700
)});
  return main;
}
