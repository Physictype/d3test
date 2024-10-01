import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

// Set the dimensions and margins of the graph
var margin = {top: 10, right: 30, bottom: 30, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// Append the SVG object to the body of the page
var svg = d3.select("#my_dataviz")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// Read the data
const data = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv", function(d) {
  return { date: d3.timeParse("%Y-%m-%d")(d.date), value: +d.value }; // Parse date and convert value to number
});

// Define the scales
const x = d3.scaleTime()  // Use scaleTime for the x-axis since we have date data
  .domain(d3.extent(data, d => d.date))  // Set the domain based on the data
  .range([0, width]);

const y = d3.scaleLinear()  // Use scaleLinear for the y-axis
  .domain([0, d3.max(data, d => d.value)])  // Set the domain based on the data
  .range([height, 0]);  // Invert the range for y-axis

// Add the x-axis
const xaxis = svg.append("g")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(x));

// Add the y-axis
const yaxis = svg.append("g")
  .call(d3.axisLeft(y));

// Create the line generator
const line = d3.line()
  .x(d => x(d.date))  // Define x coordinate using x scale
  .y(d => y(d.value));  // Define y coordinate using y scale
// Add the line path to the SVG
var path = svg.append("path")
  .datum(data)  // Bind the data
  .attr("fill", "none")  // No fill for the line
  .attr("stroke", "steelblue")  // Line color
  .attr("stroke-width", 1.5)  // Line width
  .attr("d", line);  // Generate the path data using the line generator

// d3.select("#zoomout").on("click",(event) => {
    
// })
var range = d3.max(data,d=>d.value);
d3.select("body").on("click",(event) => {
    range *= 0.75
    // Define a new domain for the x-axis
    const newDomain = [
        0, 
        range
    ];
    
    // Update the x scale
    y.domain(newDomain);

    // Transition the x-axis
    yaxis.transition()
        .duration(400)  // Duration of the transition
        .call(d3.axisLeft(y));

    // Transition the line
    path.transition()
        .duration(400)
        .attr("d", line);
}).on("contextmenu", function (event) {
    event.preventDefault();
   range *= 1.333
   // Define a new domain for the x-axis
   const newDomain = [
       0, 
       range
   ];
   
   // Update the x scale
   y.domain(newDomain);

   // Transition the x-axis
   yaxis.transition()
       .duration(400)  // Duration of the transition
       .call(d3.axisLeft(y));

   // Transition the line
   path.transition()
       .duration(400)
       .attr("d", line);
});