// https://observablehq.com/@normaloide/milan-air-pollution-from-2008-to-2018@646
import define1 from "./8d5ef3030dfd3bad@249.js";

export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["d3js10anni.csv",new URL("./files/28e13a3e6c21524926cb9cf1bf913e0363f53c5720b959652a4b2311556cd12a4b126c9aadeb6af50de4b8f54ec1633692d774a73f1847b5d3e4f4ead4cb31c7",import.meta.url)],["elem.json",new URL("./files/3521bd19246c965d00587f6b93c0e26f4111c2b70b2608bb71e5910f9db1f47a9dd6a7ad1e5198ef24aba5a5f5582fecd2298aa6d7f798ffed6a64a3d5a5c41c",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md`# Milan air pollution from 2008 to 2018`
)});
  main.variable(observer()).define(["FileAttachment"], function(FileAttachment){return(
FileAttachment("d3js10anni.csv").text()
)});
  main.variable(observer("elem")).define("elem", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("elem.json").json()
)});
  main.variable(observer("margine")).define("margine", function(){return(
{top: 10, right: 120, bottom: 10, left: 40}
)});
  main.variable(observer("tree")).define("tree", ["d3","dx","dy"], function(d3,dx,dy){return(
d3.tree().nodeSize([dx, dy])
)});
  main.variable(observer("dx")).define("dx", function(){return(
10
)});
  main.variable(observer("dy")).define("dy", ["width"], function(width){return(
width / 6
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("chart")).define("chart", ["d3","elem","dy","margine","margin","width","dx","tree","diagonal"], function(d3,elem,dy,margine,margin,width,dx,tree,diagonal)
{
  const root = d3.hierarchy(elem);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth && d.data.name.length !== 7) d.children = null;
  });

  const svg = d3.create("svg")
      .attr("viewBox", [-margine.left, -margin.top, width, dx])
      .style("font", "10px sans-serif")
      .style("user-select", "none");

  const gLink = svg.append("g")
      .attr("fill", "none")
      .attr("stroke", "#555")
      .attr("stroke-opacity", 0.4)
      .attr("stroke-width", 1.5);

  const gNode = svg.append("g")
      .attr("cursor", "pointer")
      .attr("pointer-events", "all");

  function update(source) {
    const duration = d3.event && d3.event.altKey ? 2500 : 250;
    const nodes = root.descendants().reverse();
    const links = root.links();

    // Compute the new tree layout.
    tree(root);

    let left = root;
    let right = root;
    root.eachBefore(node => {
      if (node.x < left.x) left = node;
      if (node.x > right.x) right = node;
    });

    const height = right.x - left.x + margin.top + margin.bottom;

    const transition = svg.transition()
        .duration(duration)
        .attr("viewBox", [-margin.left, left.x - margin.top, width, height])
        .tween("resize", window.ResizeObserver ? null : () => () => svg.dispatch("toggle"));

    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);
    
    const nodeEnter = node.enter().append("g")
        .attr("transform", d => `translate(${source.y0},${source.x0})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0)
        .on("click", d => {
          d.children = d.children ? null : d._children;
          update(d);
        });

    nodeEnter.append("circle")
        .attr("r", 2.5)
        .attr("fill", d => d._children ? "#555" : "#999")
        .attr("stroke-width", 10);

    nodeEnter.append("text")
        .attr("dy", "0.31em")
        .attr("x", d => d._children ? -6 : 6)
        .attr("text-anchor", d => d._children ? "end" : "start")
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}
);
  main.variable(observer("diagonal")).define("diagonal", ["d3"], function(d3){return(
d3.linkHorizontal().x(d => d.y).y(d => d.x)
)});
  main.variable(observer("data")).define("data", ["FileAttachment","d3"], async function(FileAttachment,d3)
{
  const text = await FileAttachment("d3js10anni.csv").text();
  const parseDate = d3.utcParse("%d/%m/%Y");
  return d3.csvParse(text, ({date,avgPM10,avgNO2,avgCO_8h,avgO3,avgC6H6,avgSO2,avgPM25,valutazione}) => ({
    date: parseDate(date),
    avgPM10: +avgPM10,
    avgNO2: +avgNO2,
    avgCO_8h: +avgCO_8h,
    avgO3: +avgO3,
    avgC6H6: +avgC6H6,
    avgSO2: +avgSO2,
    avgPM25: +avgPM25,
    valutazione: d3.autoType(valutazione),
   }));
  }
);
  main.variable(observer("avgPM10")).define("avgPM10", ["data"], function(data){return(
data.map(d => d.avgPM10)
)});
  const child1 = runtime.module(define1).derive([{name: "avgPM10", alias: "data"}], main);
  main.import("chart", "chartPM10", child1);
  main.variable(observer()).define(["chartPM10"], function(chartPM10){return(
chartPM10
)});
  main.variable(observer("tempo")).define("tempo", ["data"], function(data){return(
data.map(d => d.valutazione)
)});
  main.variable(observer("isB")).define("isB", function(){return(
function isB(value) {
  return value == "B";
}
)});
  main.variable(observer("isG")).define("isG", function(){return(
function isG(value) {
  return value == "G";
}
)});
  main.variable(observer("tutteB")).define("tutteB", ["tempo","isB"], function(tempo,isB){return(
tempo.filter(isB)
)});
  main.variable(observer("tutteG")).define("tutteG", ["tempo","isG"], function(tempo,isG){return(
tempo.filter(isG)
)});
  main.variable(observer("stampa")).define("stampa", function(){return(
[{
  name : "Bad air",
  value : "944",
  "color" : "coral"
  },{ 
  name : "Good air",
  value : "2446",
  "color" : "steelblue"
   }
]
)});
  main.variable(observer("getColor")).define("getColor", function(){return(
function getColor(value){
  return value.color;
}
)});
  main.variable(observer("pieArcData")).define("pieArcData", ["d3","stampa"], function(d3,stampa){return(
d3.pie()
    .value(d => d.value)
  (stampa)
)});
  main.variable(observer("arcPie")).define("arcPie", ["d3"], function(d3){return(
d3.arc()
    .innerRadius(210)
    .outerRadius(310)
    .padRadius(300)
    .padAngle(2 / 300)
    .cornerRadius(8)
)});
  main.variable(observer()).define(["html","pieArcData","svg","arcPie"], function(html,pieArcData,svg,arcPie){return(
html`<svg viewBox="-320 -320 640 640" style="max-width: 640px;" text-anchor="middle" font-family="sans-serif">
  ${pieArcData.map(d => svg`
    <path fill=${d.data.color} d="${arcPie(d)}"></path>
    <text fill="white" transform="translate(${arcPie.centroid(d).join(",")})">
      <tspan x="0" font-size="24">${d.data.name}</tspan>
      <tspan x="0" font-size="12" dy="1.3em">${d.value.toLocaleString("en")}</tspan>
    </text>
  `)}
</svg>`
)});
  main.variable(observer("x")).define("x", ["d3","data","margin","width"], function(d3,data,margin,width){return(
d3.scaleTime()
    .domain(d3.extent(data, d => d.date))
    .range([margin.left, width - margin.right])
)});
  main.variable(observer("y")).define("y", ["d3","data","height","margin"], function(d3,data,height,margin){return(
d3.scaleLinear()
    .domain([0, d3.max(data, d => d.avgPM10)])
    .range([height - margin.bottom, margin.top])
)});
  main.variable(observer()).define(["x","data","y"], function(x,data,y)
{
  let path = `M${x(data[0].date)},${y(data[0].avgPM10)}`;
  for (let i = 1; i < data.length; ++i) {
    path += `L${x(data[i].date)},${y(data[i].avgPM10)}`;
  }
  return path;
}
);
  main.variable(observer("area")).define("area", ["d3","x","y"], function(d3,x,y){return(
d3.area()
    .x(d => x(d.date))
    .y0(y(0))
    .y1(d => y(d.avgPM10))
)});
  main.variable(observer()).define(["area","data"], function(area,data){return(
area(data)
)});
  main.variable(observer("viewof replay")).define("viewof replay", ["html"], function(html){return(
html`<button>Replay`
)});
  main.variable(observer("replay")).define("replay", ["Generators", "viewof replay"], (G, _) => G.input(_));
  main.variable(observer()).define(["replay","html","width","height","d3","svg","area","data","reveal","xAxis","yAxis"], function(replay,html,width,height,d3,svg,area,data,reveal,xAxis,yAxis){return(
replay, html`<svg viewBox="0 0 ${width} ${height}">
  ${d3.select(svg`<path d="${area(data)}" fill="none" stroke="steelblue" stroke-width="1.3" stroke-miterlimit="1" stroke-dasharray="0,1"></path>`).call(reveal).node()}
  ${d3.select(svg`<g>`).call(xAxis).node()}
  ${d3.select(svg`<g>`).call(yAxis).node()}
</svg>`
)});
  main.variable(observer("areaBand")).define("areaBand", ["d3","x","y"], function(d3,x,y){return(
d3.area()
    .x(d => x(d.date))
    .y0(d => y(d.avgPM10))
    .y1(d => y(d.avgO3))
)});
  main.variable(observer()).define(["html","width","height","areaBand","data","d3","svg","xAxis","yAxis"], function(html,width,height,areaBand,data,d3,svg,xAxis,yAxis){return(
html`<svg viewBox="0 0 ${width} ${height}">
  <path d="${areaBand(data)}" fill="white"></path>
  <g fill="none" stroke-width="0.7" stroke-miterlimit="1">
    <path d="${areaBand.lineY0()(data)}" stroke="#00f"></path>
    <path d="${areaBand.lineY1()(data)}" stroke="#f00"></path>
  </g>
  ${d3.select(svg`<g>`).call(xAxis).node()}
  ${d3.select(svg`<g>`).call(yAxis).node()}
</svg>`
)});
  main.variable(observer("height")).define("height", function(){return(
400
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 20, right: 30, bottom: 30, left: 40}
)});
  main.variable(observer("xAxis")).define("xAxis", ["height","margin","d3","x","width"], function(height,margin,d3,x,width){return(
g => g
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(d3.axisBottom(x).ticks(width / 80).tickSizeOuter(0))
)});
  main.variable(observer("yAxis")).define("yAxis", ["margin","d3","y","height"], function(margin,d3,y,height){return(
g => g
    .attr("transform", `translate(${margin.left},0)`)
    .call(d3.axisLeft(y).ticks(height / 40))
    .call(g => g.select(".domain").remove())
)});
  main.variable(observer("reveal")).define("reveal", ["d3"], function(d3){return(
path => path.transition()
    .duration(5000)
    .ease(d3.easeLinear)
    .attrTween("stroke-dasharray", function() {
      const length = this.getTotalLength();
      return d3.interpolate(`0,${length}`, `${length},${length}`);
    })
)});
  return main;
}
