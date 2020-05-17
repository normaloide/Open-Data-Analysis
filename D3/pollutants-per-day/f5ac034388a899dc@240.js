// https://observablehq.com/@elle/pollutants-per-day@240
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["mapSF.json",new URL("./files/e40d2d9b5f551896fc18aa0fcc61c630cf68617a5e4c6b8255fc238b4dc6b5ea228f0c41afedd7832998ff92fb1ef5293ed4e320aec589312ee76b291f41f976",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md
`
# Proportions of Monthly Pollutants

A non-animated treemap is used to visualize the quantity of each type of pollutant, averaged over a month. Different months and years can be selected with the a drop-down menu. Inevitably, this quantitative visualization precludes the viewing of the qualtitive "good/bad" evaluation which is included in the full dataset. The easy comparison of proportions through the treemap helps to see the differences in major pollutants between different months and years.
`
)});
  main.variable(observer("viewof year")).define("viewof year", ["html"], function(html){return(
html`
<select>
  <option value= 0 selected> 2008 </option>
  <option value= 1 > 2009 </option>
  <option value= 2 > 2010 </option>
  <option value= 3 > 2011 </option>
  <option value= 4 > 2012 </option>
  <option value= 5 > 2013 </option>
  <option value= 6 > 2014 </option>
  <option value= 7 > 2015 </option>
  <option value= 8 > 2016 </option>
  <option value= 9 > 2017 </option>
  <option value= 10 > 2018 </option>
</select>`
)});
  main.variable(observer("year")).define("year", ["Generators", "viewof year"], (G, _) => G.input(_));
  main.variable(observer("viewof month")).define("viewof month", ["html"], function(html){return(
html`
<select>
  <option value= 0 selected> January </option>
  <option value= 1 > February </option>
  <option value= 2 > March </option>
  <option value= 3 > April </option>
  <option value= 4 > May </option>
  <option value= 5 > June </option>
  <option value= 6 > July </option>
  <option value= 7 > August </option>
  <option value= 8 > September </option>
  <option value= 9 > October </option>
  <option value= 10 > November </option>
  <option value= 11 > December </option>
</select>`
)});
  main.variable(observer("month")).define("month", ["Generators", "viewof month"], (G, _) => G.input(_));
  main.variable(observer("chart")).define("chart", ["treemap","data","d3","width","height","format","DOM","color"], function(treemap,data,d3,width,height,format,DOM,color)
{
  const root = treemap(data);

  const svg = d3.create("svg")
      .attr("viewBox", [0, 0, width, height])
      .style("font", "16px sans-serif");                         // Larger font
  
  const leaf = svg.selectAll("g")
    .data(root.leaves())
    .join("g")
      .attr("transform", d => `translate(${d.x0},${d.y0})`);

  leaf.append("title")
      .text(d => `${d.ancestors().reverse().map(d => d.data.name).join("/")}\n${format(d.value)}`);

  leaf.append("rect")
      .attr("id", d => (d.leafUid = DOM.uid("leaf")).id)
      .attr("fill", d => { while (d.depth > 1) d = d.parent; return color(d.data.name); })
      .attr("fill-opacity", 0.55)                               //Lowered from default of 0.6
      .attr("width", d => d.x1 - d.x0)
      .attr("height", d => d.y1 - d.y0);

  leaf.append("clipPath")
      .attr("id", d => (d.clipUid = DOM.uid("clip")).id)
    .append("use")
      .attr("xlink:href", d => d.leafUid.href);

  leaf.append("text")
      .attr("clip-path", d => d.clipUid)
    .selectAll("tspan")
    .data(d => d.data.name.split(/(?=[A-Z][a-z])|\s+/g).concat(format(d.value)))
    .join("tspan")
      .attr("x", 3)
      .attr("y", (d, i, nodes) => `${(i === nodes.length - 1) * 0.3 + 1.1 + i * 0.9}em`)
      .attr("fill-opacity", (d, i, nodes) => i === nodes.length - 1 ? 0.7 : null)
      .text(d => d);

  return svg.node();
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("mapSF.json").json()
)});
  main.variable(observer("h")).define("h", ["d3","data","year","month"], function(d3,data,year,month){return(
d3.hierarchy(data).children[parseInt(year)].children[parseInt(month)].copy()
)});
  main.variable(observer("treemap")).define("treemap", ["d3","width","height","h"], function(d3,width,height,h){return(
data => d3.treemap()
    .tile(d3.treemapBinary)
    .size([width, height])
    .padding(2)                 // Doubled from original
    .round(true)
  (h
      .sum(d => d.value)
      .sort((a, b) => b.value - a.value))
)});
  main.variable(observer("width")).define("width", function(){return(
954
)});
  main.variable(observer("height")).define("height", function(){return(
954
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(",.2f")
)});
  main.variable(observer("color")).define("color", ["d3"], function(d3){return(
d3.scaleOrdinal(d3.schemeCategory10)
)});
  return main;
}
