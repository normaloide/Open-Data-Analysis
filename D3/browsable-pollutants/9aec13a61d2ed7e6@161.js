// https://observablehq.com/@elle/browsable-pollutants@161
export default function define(runtime, observer) {
  const main = runtime.module();
  const fileAttachments = new Map([["allSF.json",new URL("./files/c7cad0ee0a4b6aaead593f38d370bd28920396f42df5eaee1a8c18cea2f963de9be9461b93653d7b67b92bd5823b20f6ec31ab0667eb6acac2bb48694d19cff7",import.meta.url)]]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer()).define(["md"], function(md){return(
md
`# Browsable Pollutants
The entirety of the dataset is browsable in hierarchical form (by dates) using a collapsible tree that emphasizes the structure of the data rather than its values. Colors aid comparisons and recognition of pollutants.

Click on the 2008 - 2018 root to begin browsing.
`
)});
  main.variable(observer("chart")).define("chart", ["d3","data","dy","margin","width","dx","tree","color","diagonal"], function(d3,data,dy,margin,width,dx,tree,color,diagonal)
{
  const root = d3.hierarchy(data);

  root.x0 = dy / 2;
  root.y0 = 0;
  root.descendants().forEach((d, i) => {
    d.id = i;
    d._children = d.children;
    if (d.depth !== 7) d.children = null;               // Skips creating any nodes automatically (unlike the default)
  });

  const svg = d3.create("svg")
      .attr("viewBox", [-margin.left, -margin.top, width, dx])
      .style("font", "14px sans-serif")
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

    // Update the nodes…
    const node = gNode.selectAll("g")
      .data(nodes, d => d.id);

    // Enter any new nodes at the parent's previous position.
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
        .attr("fill", (d => color(d.data.name)))                         // feature-based colors
        .text(d => d.data.name)
      .clone(true).lower()
        .attr("stroke-linejoin", "round")
        .attr("stroke-width", 3)
        .attr("stroke", "white");

    // Transition nodes to their new position.
    const nodeUpdate = node.merge(nodeEnter).transition(transition)
        .attr("transform", d => `translate(${d.y},${d.x})`)
        .attr("fill-opacity", 1)
        .attr("stroke-opacity", 1);

    // Transition exiting nodes to the parent's new position.
    const nodeExit = node.exit().transition(transition).remove()
        .attr("transform", d => `translate(${source.y},${source.x})`)
        .attr("fill-opacity", 0)
        .attr("stroke-opacity", 0);

    // Update the links…
    const link = gLink.selectAll("path")
      .data(links, d => d.target.id);

    // Enter any new links at the parent's previous position.
    const linkEnter = link.enter().append("path")
        .attr("d", d => {
          const o = {x: source.x0, y: source.y0};
          return diagonal({source: o, target: o});
        });

    // Transition links to their new position.
    link.merge(linkEnter).transition(transition)
        .attr("d", diagonal);

    // Transition exiting nodes to the parent's new position.
    link.exit().transition(transition).remove()
        .attr("d", d => {
          const o = {x: source.x, y: source.y};
          return diagonal({source: o, target: o});
        });

    // Stash the old positions for transition.
    root.eachBefore(d => {
      d.x0 = d.x;
      d.y0 = d.y;
    });
  }

  update(root);

  return svg.node();
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("color")).define("color", function(){return(
text =>                                               // Custom color-selection function
{
  if (text.includes("PM10:")) return "#414e00";
  if (text.includes("NO2:")) return "#6299ff";
  if (text.includes("CO:")) return "#a9a500";
  if (text.includes("O3:")) return "#ba1d88";
  if (text.includes("C6H6:")) return "#01bc6c";
  if (text.includes("SO2:")) return "#fa5068";
  if (text.includes("PM25:")) return "#001e6b";
  if (text.includes("Valutazione:")) return "#e9603a";
  return "black";
}
)});
  main.variable(observer("format")).define("format", ["d3"], function(d3){return(
d3.format(",.2f")
)});
  main.variable(observer("diagonal")).define("diagonal", ["d3"], function(d3){return(
d3.linkHorizontal().x(d => d.y).y(d => d.x)
)});
  main.variable(observer("tree")).define("tree", ["d3","dx","dy"], function(d3,dx,dy){return(
d3.tree().nodeSize([dx, dy])
)});
  main.variable(observer("data")).define("data", ["FileAttachment"], function(FileAttachment){return(
FileAttachment("allSF.json").json()
)});
  main.variable(observer("dx")).define("dx", function(){return(
20
)});
  main.variable(observer("dy")).define("dy", ["width"], function(width){return(
width / 6
)});
  main.variable(observer("margin")).define("margin", function(){return(
{top: 10, right: 120, bottom: 10, left: 90}
)});
  return main;
}
