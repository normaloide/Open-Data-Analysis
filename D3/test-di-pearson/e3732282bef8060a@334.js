// https://observablehq.com/@darkbeccio/test-di-pearson@334
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Test di Pearson`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("pearsonTestOutput")).define("pearsonTestOutput", function(){return(
[{
    name : "avgPm10",
    correlation : -0.78,
    p_value : 0.0,
    text_pos : 20,
    color : "darkorchid"
  },{
    name : "avgNO2",
    correlation : -0.49,
    p_value : 1.0685186434617961e-203,
    text_pos : 40,
    color : "midnightblue"
  },{
    name : "avgCO_8h",
    correlation : -0.60,
    p_value : 3e-323,
    text_pos : 60,
    color : "cadetblue"
  },{
    name : "avgO3",
    correlation : 0.34,
    p_value :9.160924855019311e-95,
    text_pos : 80,
    color : "seagreen"
  },{
    name : "avgC6H6",
    correlation : -0.59,
    p_value : 4.3213674e-316,
    text_pos : 100,
    color : "goldenrod"
  },{
    name : "avgSO2",
    correlation : -0.14,
    p_value : 9.241933506551531e-17,
    text_pos : 120,
    color : "slategray"
  },{
    name : "avgPM25",
    correlation : -0.73,
    p_value : 0.0,
    text_pos : 140,
    color : "limegreen"
  }]
)});
  main.variable(observer("x_scale")).define("x_scale", ["d3"], function(d3){return(
d3.scaleLinear()
            .domain([-1.0,1.0])
             .range([10,930])
)});
  main.variable(observer("x_axis")).define("x_axis", ["d3","x_scale"], function(d3,x_scale){return(
d3.axisTop()
          .scale(x_scale)
)});
  main.variable(observer("y_scale")).define("y_scale", ["d3"], function(d3){return(
d3.scaleLinear()
          .range([10,160])
)});
  main.variable(observer("svg")).define("svg", ["d3","DOM"], function(d3,DOM){return(
d3.select(DOM.svg(1000,400))
)});
  main.variable(observer("D3Svg")).define("D3Svg", ["d3"], function(d3){return(
d3.selectAll('svg').remove()
)});
  main.variable(observer()).define(["d3","pearsonTestOutput","svg","x_axis","x_scale"], function(d3,pearsonTestOutput,svg,x_axis,x_scale)
{
var colori =  d3.scaleOrdinal().domain(pearsonTestOutput.map(d=> d.correlation))
              .range(pearsonTestOutput.map(d => d.color))

var nomi = d3.scaleOrdinal().domain(pearsonTestOutput.map(d=> d.correlation))
              .range(pearsonTestOutput.map(d => d.name))

var textPosition = d3.scaleOrdinal().domain(pearsonTestOutput.map(d=> d.correlation))
                    .range(pearsonTestOutput.map(d => d.text_pos))
svg.append("g")
  .attr("transform", "translate(10,200)")
  .style("font-size","20px")
  .call(x_axis)
  
  
svg.selectAll('circle')
    .data([-0.78,-0.49,-0.60,0.34,-0.59,-0.14,-0.73])
    .enter()
    .append('circle')
     .transition()
    .duration(4000)
    .attr('cx', d => x_scale(d))
    .attr('cy', 200)
    .attr('r', 10)
    .attr('fill',d => colori(d))
  
svg.selectAll('rect')
  .data([-0.78,-0.49,-0.60,0.34,-0.59,-0.14,-0.73])
  .enter()
  .append('rect')
  .transition()
  .duration(4000)
  .attr('x',d => x_scale(d))
  .attr('y', d => textPosition(d))
  .attr("width",2)
  .attr("height",300 )
  .attr('fill',d => colori(d))
  
svg.selectAll(".text")
.data([-0.78,-0.49,-0.60,0.34,-0.59,-0.14,-0.73])
.enter()
.append("text")
.attr("x",d => x_scale(d))
.attr("y",d => textPosition(d))
.text(d => nomi(d))
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", d => colori(d));
  
  
  
return svg.node()
}
);
  return main;
}
