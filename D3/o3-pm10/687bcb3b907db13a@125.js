// https://observablehq.com/@darkbeccio/o3-pm10@125
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Ozono Gennaio/Agosto
`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("ozono")).define("ozono", function(){return(
[{
    year : 2008,
    january : 	24.12903226,
    august : 133.016129
  },{
    year : 2009,
    january : 19.29569892,
    august : 143.0107527
  },{
    year : 2010,
    january : 17.13218391,
    august : 110.5322581
  },{
    year : 2011,
    january : 15.53763441,
    august : 137.2258065
  },{
    year : 2012,
    january : 22.60215054,
    august : 132.8655914
  },{
    year : 2013,
    january : 15.0952381,
    august : 124.9871795
  },{
    year : 2014,
    january : 16.96376812,
    august : 97.52873563
  },{
    year : 2015,
    january : 32.68888889,
    august : 121.9285714
  },{
    year : 2016,
    january : 19.08888889,
    august : 116.3240741
  },{
    year : 2017,
    january : 30.11764706,
    august : 141.7254902
  },{
    year : 2018,
    january : 29.4,
    august : 144.75
  }]
)});
  main.variable(observer()).define(["d3","DOM","width","ozono"], function(d3,DOM,width,ozono)
{
  const height = 500
  const  svg = d3.select(DOM.svg(width, height))
  
  const margin = { left: 30, top: 20, right: 20, bottom: 20 }
  
  const xScale = d3.scaleLinear()
    .domain(d3.extent(ozono.map(d => d.year)))
    .range([margin.left, width - margin.right])
  
  svg.append('g')
    .call(d3.axisBottom(xScale))
    .attr('transform', `translate(0,${height - margin.bottom})`)
  
  const yScale = d3.scaleLinear()
    .range([height - margin.bottom, margin.top])
    .domain([0,200])
  
  svg.append('g')
    .call(d3.axisLeft(yScale))
    .attr('transform', `translate(${margin.left},0)`)
  
  svg.selectAll('circle1')
    .data(ozono)
    .enter()
    .append('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.january))
      .transition() 
      .duration(4000)
      .attr('r', 10)
      .attr('fill', 'blue')
  
    svg.selectAll('circle2')
    .data(ozono)
    .enter()
    .append('circle')
      .attr('cx', d => xScale(d.year))
      .attr('cy', d => yScale(d.august))
      .transition() 
      .duration(4000)
      .attr('r', 10)
      .attr('fill', 'red')
  
svg.append('line')
    .style("stroke", "lightgreen")
    .style("stroke-width", 2)
    .transition() 
    .duration(6000)
    .attr("x1", xScale(2008))
    .attr("y1", yScale(22.00))
     .transition() 
    .duration(6000)
    .attr("x2", xScale(2018))
    .attr("y2", yScale(22.00)); 
  
  svg.append('line')
    .style("stroke", "lightgreen")
    .style("stroke-width", 2)
    .transition() 
    .duration(6000)
    .attr("x1", xScale(2008))
    .attr("y1", yScale(127.6267808))
      .transition() 
    .duration(6000)
    .attr("x2", xScale(2018))
    .attr("y2", yScale(127.6267808))
  
 svg.append("text")
.attr("x",100)
.attr("y",300)
.text("Gennaio")
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "blue");
  
  svg.append("text")
.attr("x",100)
.attr("y",20)
.text("Agosto")
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "red");
  
  
  return svg.node()
}
);
  return main;
}
