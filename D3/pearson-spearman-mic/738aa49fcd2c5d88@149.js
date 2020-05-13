// https://observablehq.com/@darkbeccio/pearson-spearman-mic@149
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Moduli Pearson,Spearman,Mic rispetto al Target`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer("testPearsonOutput")).define("testPearsonOutput", function(){return(
[{
    name : "avgPm10",
    correlation :0.78,
    p_value : 0.0,
    text_pos : 20,
    color : "darkorchid"
  },{
    name : "avgNO2",
    correlation : 0.49,
    p_value : 1.0685186434617961e-203,
    text_pos : 40,
    color : "midnightblue"
  },{
    name : "avgCO_8h",
    correlation : 0.60,
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
    correlation : 0.59,
    p_value : 4.3213674e-316,
    text_pos : 100,
    color : "goldenrod"
  },{
    name : "avgSO2",
    correlation : 0.14,
    p_value : 9.241933506551531e-17,
    text_pos : 120,
    color : "slategray"
  },{
    name : "avgPM25",
    correlation : 0.73,
    p_value : 0.0,
    text_pos : 140,
    color : "limegreen"
  }]
)});
  main.variable(observer("testSpearmanOutput")).define("testSpearmanOutput", function(){return(
[{
    name : "avgPm10",
    correlation : 0.73,
    p_value : 0.0,
    text_pos : 20,
    color : "darkorchid"
  },{
    name : "avgNO2",
    correlation : 0.46,
    p_value : 6.506542835752362e-173,
    text_pos : 40,
    color : "midnightblue"
  },{
    name : "avgCO_8h",
    correlation : 0.56,
    p_value : 3e-323,
    text_pos : 60,
    color : "cadetblue"
  },{
    name : "avgO3",
    correlation : 0.39,
    p_value :4.878605754240643e-125,
    text_pos : 80,
    color : "seagreen"
  },{
    name : "avgC6H6",
    correlation : 0.55,
    p_value : 2.564458588668805e-265,
    text_pos : 100,
    color : "goldenrod"
  },{
    name : "avgSO2",
    correlation : 0.12,
    p_value : 1.3898640092681807e-11,
    text_pos : 120,
    color : "slategray"
  },{
    name : "avgPM25",
    correlation : 0.68,
    p_value : 0.0,
    text_pos : 140,
    color : "limegreen"
  }]
)});
  main.variable(observer("testMicOutput")).define("testMicOutput", function(){return(
[{
    name : "avgPm10",
    correlation : 0.72,
    text_pos : 20,
    color : "darkorchid"
  },{
    name : "avgNO2",
    correlation : 0.26,
    text_pos : 40,
    color : "midnightblue"
  },{
    name : "avgCO_8h",
    correlation : 0.33,
    text_pos : 60,
    color : "cadetblue"
  },{
    name : "avgO3",
    correlation :0.31,
    text_pos : 80,
    color : "seagreen"
  },{
    name : "avgC6H6",
    correlation : 0.32,
    text_pos : 100,
    color : "goldenrod"
  },{
    name : "avgSO2",
    correlation : 0.02,
    text_pos : 120,
    color : "slategray"
  },{
    name : "avgPM25",
    correlation : 0.53,
    text_pos : 140,
    color : "limegreen"
  }]
)});
  main.variable(observer("y_scale")).define("y_scale", ["d3"], function(d3){return(
d3.scaleLinear()
          .domain([1.00,0.00])
          .range([100,900])
)});
  main.variable(observer("y_axis")).define("y_axis", ["d3","y_scale"], function(d3,y_scale){return(
d3.axisLeft()
          .scale(y_scale)
)});
  main.variable(observer("Pearson")).define("Pearson", ["testPearsonOutput"], function(testPearsonOutput){return(
testPearsonOutput.map(d => d.correlation)
)});
  main.variable(observer("Spearman")).define("Spearman", ["testSpearmanOutput"], function(testSpearmanOutput){return(
testSpearmanOutput.map(d => d.correlation)
)});
  main.variable(observer("Mic")).define("Mic", ["testMicOutput"], function(testMicOutput){return(
testMicOutput.map(d => d.correlation)
)});
  main.variable(observer("svg")).define("svg", ["d3","DOM"], function(d3,DOM){return(
d3.select(DOM.svg(600,1000))
)});
  main.variable(observer("D3Svg")).define("D3Svg", ["d3"], function(d3){return(
d3.selectAll('svg').remove()
)});
  main.variable(observer()).define(["d3","testPearsonOutput","testSpearmanOutput","testMicOutput","svg","y_axis","y_scale"], function(d3,testPearsonOutput,testSpearmanOutput,testMicOutput,svg,y_axis,y_scale)
{
  var coloriP =  d3.scaleOrdinal().domain(testPearsonOutput.map(d=> d.correlation))
              .range(testPearsonOutput.map(d => d.color))
  
  var coloriS =  d3.scaleOrdinal().domain(testSpearmanOutput.map(d=> d.correlation))
              .range(testSpearmanOutput.map(d => d.color))
  
  var coloriM =  d3.scaleOrdinal().domain(testMicOutput.map(d=> d.correlation))
                 .range(testMicOutput.map(d => d.color))
  
  var nomi =  d3.scaleOrdinal().domain(testMicOutput.map(d=> d.correlation))
                 .range(testMicOutput.map(d => d.name))
  
  svg.append("g")
  .attr("transform", "translate(150,0)")
  .style("font-size","20px")
  .call(y_axis)
  
      svg.append("g")
  .attr("transform", "translate(300,0)")
  .style("font-size","20px")
  .call(y_axis)
  
       svg.append("g")
  .attr("transform", "translate(450,0)")
  .style("font-size","20px")
  .call(y_axis)
  
  svg.selectAll('circle1')
    .data([0.78, 0.49, 0.6, 0.34, 0.59, 0.14, 0.73])
    .enter()
    .append('circle')
    .attr('cx', 150)
    .attr('cy', d => y_scale(d))
      .transition()
    .duration(4000)
    .attr('r', 10)
    .attr('fill',d => coloriP(d))
  
   svg.selectAll('circle2')
    .data([0.73, 0.46, 0.56, 0.39, 0.55, 0.12, 0.68])
    .enter()
    .append('circle')
    .attr('cx', 300)
    .attr('cy', d => y_scale(d))
    .transition()
    .duration(4000)
    .attr('r', 10)
    .attr('fill',d => coloriS(d))
  
   svg.selectAll('circle3')
    .data([0.72, 0.26, 0.33, 0.31, 0.32, 0.02, 0.53])
    .enter()
    .append('circle')
    .attr('cx', 450)
    .attr('cy', d => y_scale(d))
      .transition()
    .duration(4000)
    .attr('r', 10)
    .attr('fill',d => coloriM(d))
  
  svg.selectAll(".text")
    .data([1])
    .enter()
    .append("text")
    .attr("x",130)
    .attr("y",70)
    .text("P")
    .attr("font-family", "sans-serif")
    .attr("font-size", "40px")
    .attr("fill", "red");
  
    svg.selectAll(".text2")
    .data([1])
    .enter()
    .append("text")
    .attr("x",280)
    .attr("y",70)
    .text("S")
    .attr("font-family", "sans-serif")
    .attr("font-size", "40px")
    .attr("fill", "red");
  
    svg.selectAll(".text3")
    .data([1])
    .enter()
    .append("text")
    .attr("x",430)
    .attr("y",70)
    .text("M")
    .attr("font-family", "sans-serif")
    .attr("font-size", "40px")
    .attr("fill", "red");
  
     svg.selectAll(".text4")
    .data([0.9,0.5,0.7,0.4,0.6,0.3,0.8])
    .enter()
    .append("text")
    .attr("x",500)
     .transition()
    .duration(6000)
     .attr("y",d => y_scale(d))
    .text(d => nomi(d))
    .attr("font-family", "sans-serif")
    .attr("font-size", "20px")
    .attr("fill", d => coloriM(d));
  
return svg.node();
}
);
  return main;
}
