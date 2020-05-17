// https://observablehq.com/@elle/pm10-a-classic-pollutant@39
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["pm10SF.json",new URL("./files/ed9b8f2bd68f64a3fec238b0758e06c94a2245a5f579e3dbecbde00630bbeffddd47e7a5787552009356ed622b8be229b0e56dca159c5449c87e0cafb3487b97",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md
`
# PM10: a Classic Pollutant

## Graph Information
A zoomable icicle graph. The zoom function helps with the significant size of the dataset, while the icicle form creates an intuitive understanding of the aggregate amount of pollution for each year or month. In addition, zoomed-out levels of the hierarchical tree form rag plot-like visualizations which help see periodic trends in the data. This visualization emphasizes sheer quantity over the structure of the data.

## Cyclic Progress on PM10...?
PM10 is one of the most well-known pollutants, almost being synonymous with pollution itself. While the icicle graph shows a general improvement over the years, this improvement is not always smooth and experiences uneven swings, such as the sudden increase in 2011 despite the reduction in previous years. PM10 is also cyclical over a single year, due to being produced more during the cold winter months when heating is widely-used. However, zooming in further into the individual months and their days shows even more swings for every single day, indicating that whatever progress is being made in reducing PM10 is not always consistent, especially when the data is observed at a low granularity. Some of these swings may be blamed on specific events, such as the use of fireworks in January 1st, but are otherwise somewhat mysterious.
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
FileAttachment("pm10SF.json").json()
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
