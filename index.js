const url = "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";

d3.json(url).then(data => {
    const dataset = data;

    const margin = { top: 60, right: 30, bottom: 60, left: 60 };
    const width = 800 - margin.left - margin.right;
    const height = 400 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
        .domain([d3.min(dataset, d => new Date(d.Year - 1, 0, 1)), d3.max(dataset, d => new Date(d.Year + 1, 0, 1))])
        .range([0, width]);

    const y = d3.scaleTime()
        .domain([d3.min(dataset, d => new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60)), d3.max(dataset, d => new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60))])
        .range([height, 0]);

    const xAxis = d3.axisBottom(x).tickFormat(d3.timeFormat("%Y"));
    const yAxis = d3.axisLeft(y).tickFormat(d3.timeFormat("%M:%S"));

    svg.append("g")
        .attr("id", "x-axis")
        .attr("transform", `translate(0,${height})`)
        .call(xAxis);

    svg.append("g")
        .attr("id", "y-axis")
        .call(yAxis);

    svg.selectAll(".dot")
        .data(dataset)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("data-xvalue", d => new Date(d.Year, 0, 1))
        .attr("data-yvalue", d => new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60))
        .attr("cx", d => x(new Date(d.Year, 0, 1)))
        .attr("cy", d => y(new Date(1970, 0, 1, 0, d.Seconds / 60, d.Seconds % 60)))
        .attr("r", 5)
        .attr("fill", d => d.Doping ? "red" : "blue")
        .on("mouseover", (event, d) => {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(200).style("opacity", .9);
            tooltip.html(`${d.Name}: ${d.Nationality}<br>Year: ${d.Year}, Time: ${d.Time}${d.Doping ? `<br><br>${d.Doping}` : ''}`)
                .attr("data-year", d.Year)
                .style("left", `${event.pageX + 5}px`)
                .style("top", `${event.pageY - 28}px`);
        })
        .on("mouseout", () => {
            const tooltip = d3.select("#tooltip");
            tooltip.transition().duration(500).style("opacity", 0);
        });

    const legend = d3.select("#legend")
        .append("svg")
        .attr("width", 200)
        .attr("height", 50);

    legend.append("rect")
        .attr("x", 10)
        .attr("y", 10)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "blue");

    legend.append("text")
        .attr("x", 25)
        .attr("y", 20)
        .text("No Doping Allegations");

    legend.append("rect")
        .attr("x", 10)
        .attr("y", 30)
        .attr("width", 10)
        .attr("height", 10)
        .attr("fill", "red");

    legend.append("text")
        .attr("x", 25)
        .attr("y", 40)
        .text("Doping Allegations");
});
