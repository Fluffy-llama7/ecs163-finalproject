// Load D3 and d3-sankey from CDN (only required if this is in browser context)
const script1 = document.createElement('script');
script1.src = 'https://d3js.org/d3.v7.min.js';
document.head.appendChild(script1);

const script2 = document.createElement('script');
script2.src = 'https://cdn.jsdelivr.net/npm/d3-sankey@0.12.3/dist/d3-sankey.min.js';
document.head.appendChild(script2);

// Wait for both scripts to load
script2.onload = () => {
  const width = 700;
  const height = 400;

  // Create the SVG
  const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // Sample data
  const graph = {
    nodes: [
      { name: "A" },
      { name: "B" },
      { name: "C" },
      { name: "D" }
    ],
    links: [
      { source: "A", target: "B", value: 5 },
      { source: "A", target: "C", value: 3 },
      { source: "B", target: "D", value: 2 },
      { source: "C", target: "D", value: 4 }
    ]
  };

  // Map node names to objects
  const nodeMap = new Map(graph.nodes.map(d => [d.name, d]));
  graph.links = graph.links.map(d => ({
    ...d,
    source: nodeMap.get(d.source),
    target: nodeMap.get(d.target)
  }));

  // Sankey layout
  const sankey = d3.sankey()
    .nodeWidth(20)
    .nodePadding(10)
    .extent([[1, 1], [width - 1, height - 6]]);

  const { nodes, links } = sankey(graph);

  // Draw links
  svg.append("g")
    .selectAll("path")
    .data(links)
    .join("path")
    .attr("fill", "none")
    .attr("stroke", "#007BFF")
    .attr("stroke-opacity", 0.5)
    .attr("stroke-width", d => Math.max(1, d.width))
    .attr("d", d3.sankeyLinkHorizontal());

  // Draw nodes
  const node = svg.append("g")
    .selectAll("g")
    .data(nodes)
    .join("g");

  node.append("rect")
    .attr("x", d => d.x0)
    .attr("y", d => d.y0)
    .attr("height", d => d.y1 - d.y0)
    .attr("width", d => d.x1 - d.x0)
    .attr("fill", "#69b3a2")
    .attr("stroke", "#000");

  node.append("text")
    .attr("x", d => d.x0 - 6)
    .attr("y", d => (d.y1 + d.y0) / 2)
    .attr("dy", "0.35em")
    .attr("text-anchor", "end")
    .text(d => d.name)
    .filter(d => d.x0 < width / 2)
    .attr("x", d => d.x1 + 6)
    .attr("text-anchor", "start");
};

