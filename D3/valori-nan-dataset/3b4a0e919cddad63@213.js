// https://observablehq.com/@darkbeccio/prove@213
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Valori NaN nel dataset`
)});
  main.variable(observer("nanValues")).define("nanValues", function(){return(
[{
    name : "avgPm10",
    nanNumber : 0,
    totValue : 3390,
    percentuale : 0,
    color : "darkorchid"
  },{
    name : "avgNO2",
    nanNumber : 0,
    totValue : 3390,
    percentuale : 0,
    color : "midnightblue"
  },{
    name : "avgCO_8h",
    nanNumber : 0,
    totValue : 3390,
    percentuale : 0,
    color : "cadetblue"
  },{
    name : "avgO3",
    nanNumber : 2,
    totValue : 3390,
    percentuale : 0.06,
    color : "seagreen"
  },{
    name : "avgC6H6",
    nanNumber : 38,
    totValue : 3390,
    percentuale : 1.12,
    color : "goldenrod"
  },{
    name : "avgSO2",
    nanNumber : 257,
    totValue : 3390,
    percentuale : 7.58,
    color : "slategray"
  },{
    name : "avgPM25",
    nanNumber : 180,
    totValue : 3390,
    percentuale : 5.31,
    color : "limegreen"
  }]
)});
  main.variable(observer("xScale")).define("xScale", ["d3","nanValues"], function(d3,nanValues){return(
d3.scaleBand() //Ordinal scale
           .domain(d3.range(nanValues.length)) //sets the input domain for the scale
           .rangeRound([0, 1000]) //enables rounding of the range
           .paddingInner(0.05)
)});
  main.variable(observer("yScale")).define("yScale", ["d3","nanValues"], function(d3,nanValues){return(
d3.scaleBand()
					 .domain(d3.range(nanValues.length)) 
					 .range([50,200])
)});
  main.variable(observer("xScaleC")).define("xScaleC", ["d3","nanValues"], function(d3,nanValues){return(
d3.scaleBand() //Ordinal scale
           .domain(d3.range(nanValues.length)) //sets the input domain for the scale
           .rangeRound([100, 1000]) //enables rounding of the range
           .paddingInner(0.05)
)});
  main.variable(observer("xScaleT")).define("xScaleT", ["d3","nanValues"], function(d3,nanValues){return(
d3.scaleBand() //Ordinal scale
           .domain(d3.range(nanValues.length)) //sets the input domain for the scale
           .rangeRound([0 , 1000]) //enables rounding of the range
           .paddingInner(0.05)
)});
  main.variable(observer("svg")).define("svg", ["d3","DOM"], function(d3,DOM){return(
d3.select(DOM.svg(1000,300))
)});
  main.variable(observer("D3Svg")).define("D3Svg", ["d3"], function(d3){return(
d3.selectAll('svg').remove()
)});
  main.variable(observer()).define(["svg","nanValues","xScale","xScaleC","xScaleT"], function(svg,nanValues,xScale,xScaleC,xScaleT)
{
  svg.selectAll(".rect")
  .data(nanValues)
  .enter()
  .append("rect")
  .attr("x",function(d, i) { 
    return xScale(i); 
  })
  .attr("y",90) 
  .attr("width", 100)
  .attr("height", 100)
  .attr("rx",3)
  .attr("ry",5)
  .attr("fill","white")
  .attr("stroke",d => d.color)
  .attr("stroke-width",4);
  
  svg.selectAll(".circle")
  .data(nanValues)
  .enter()
  .append("circle")
  .attr("cx",function(d, i) {
    return xScaleC(i)
   })
  .transition() 
  .duration(4000)
  .attr("cy",150)
  .attr("r",d => d.percentuale)
  .transition() 
  .duration(4000)
  .attr("fill","red")
  .attr("stroke","black")
  .attr("stroke-width",3);
  
  svg.selectAll(".text")
.data(nanValues)
.enter()
.append("text")
.attr("x",function(d, i) { 
    return xScale(i); 
  })
.attr("y",50)
.text(d => d.name)
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", d => d.color);
  
 svg.selectAll(".text2")
.data(nanValues)
.enter()
.append("text")
.attr("x",function(d, i) { 
    return xScaleT(i); 
  })
.attr("y",250)
.text(d => d.percentuale + "%")
.attr("font-family", "sans-serif")
.attr("font-size", "30px")
.attr("fill","red");
  
 svg.selectAll(".text3")
.data(nanValues)
.enter()
.append("text")
.attr("x",function(d, i) { 
    return xScaleT(i); 
  })
.attr("y",250)
.text(d => d.percentuale + "%")
.attr("font-family", "sans-serif")
.attr("font-size", "30px")
.attr("fill","red");
  
  return svg.node()
}
);
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  return main;
}
