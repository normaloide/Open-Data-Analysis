// https://observablehq.com/@darkbeccio/pm10-gennaio-agosto@46
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# PM10 Gennaio/Agosto`
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require('d3@5')
)});
  main.variable(observer("ozono")).define("ozono", function(){return(
[{
    year : 2008,
    january : 	62.48,
    august : 25.60
  },{
    year : 2009,
    january : 82.72,
    august : 26.98
  },{
    year : 2010,
    january : 74.78,
    august : 20.13
  },{
    year : 2011,
    january : 80.04,
    august : 24.87
  },{
    year : 2012,
    january : 71.37,
    august : 25.67
  },{
    year : 2013,
    january : 58.79,
    august : 20.39
  },{
    year : 2014,
    january : 43.49,
    august : 16.80
  },{
    year : 2015,
    january : 56.20,
    august :25.92
  },{
    year : 2016,
    january : 55.94,
    august : 18.69
  },{
    year : 2017,
    january : 67.26,
    august : 22.34
  },{
    year : 2018,
    january : 45.33,
    august : 21.82
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
    .domain([0,100])
  
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
    .attr("y1", yScale(22.66))
     .transition() 
    .duration(6000)
    .attr("x2", xScale(2018))
    .attr("y2", yScale(22.66)); 
  
  svg.append('line')
    .style("stroke", "lightgreen")
    .style("stroke-width", 2)
    .transition() 
    .duration(6000)
    .attr("x1", xScale(2008))
    .attr("y1", yScale(63.49))
      .transition() 
    .duration(6000)
    .attr("x2", xScale(2018))
    .attr("y2", yScale(63.49))
  
 svg.append("text")
.attr("x",100)
.attr("y",300)
.text("Agosto")
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "red");
  
  svg.append("text")
.attr("x",100)
.attr("y",20)
.text("Gennaio")
.attr("font-family", "sans-serif")
.attr("font-size", "20px")
.attr("fill", "blue");
  
  
  return svg.node()
}
);
  return main;
}
