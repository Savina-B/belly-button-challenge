// Creating charts and loading data
function init() {
  //Loading JSON file
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // Dropdown element
    var dropdown = d3.select("#selDataset");

    // Drop down element options
    data.names.forEach((name) => {
      dropdown.append("option").text(name).property("value", name);
    });

    // Dashboard initialisation with subject [0]
    var initialSubject = data.names[0];
    updateCharts(initialSubject);
    updateGaugeChart(initialSubject); 
  });
}

// Update charts function
function updateCharts(subjectId) {
  // Loading subject data
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    // Filtering data to subject chosen
    var selectedSubject = data.samples.find((sample) => sample.id === subjectId);

    // Horizontal bar chart
    var barData = [{
      type: "bar",
      x: selectedSubject.sample_values.slice(0, 10).reverse(),
      y: selectedSubject.otu_ids.slice(0, 10).map(id => `OTU ${id}`).reverse(),
      text: selectedSubject.otu_labels.slice(0, 10).reverse(),
      orientation: "h"
    }];

    var barLayout = {
      title: `Top 10 OTUs for Subject ${subjectId}`
    };

    Plotly.newPlot("bar", barData, barLayout);

    // Bubble chart
    var bubbleData = [{
      x: selectedSubject.otu_ids,
      y: selectedSubject.sample_values,
      text: selectedSubject.otu_labels,
      mode: "markers",
      marker: {
        size: selectedSubject.sample_values,
        color: selectedSubject.otu_ids,
        colorscale: "Earth"
      }
    }];

    var bubbleLayout = {
      title: `Bacteria Cultures for Subject ${subjectId}`,
      xaxis: { title: "OTU ID" },
      yaxis: { title: "Sample Values" }
    };

    Plotly.newPlot("bubble", bubbleData, bubbleLayout);

    // Sample metadata
    var metadata = data.metadata.find((meta) => meta.id.toString() === subjectId);

    var metadataPanel = d3.select("#sample-metadata");
    metadataPanel.html(""); // Clear existing metadata

    // Metadata loop-through
    Object.entries(metadata).forEach(([key, value]) => {
      metadataPanel.append("p").text(`${key}: ${value}`);
    });
  });
}

// Gauge chart creation
function updateGaugeChart(subjectId) {
  //Test subject's washing frequency data
  d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then((data) => {
    var metadata = data.metadata.find((meta) => meta.id.toString() === subjectId);

    // The washing frequency value
    var washFrequency = metadata.wfreq;

    // the gauge chart creation
    var gaugeData = [
      {
        domain: { x: [0, 1], y: [0, 1] },
        value: washFrequency,
        title: { text: "Weekly Washing Frequency" },
        type: "indicator",
        mode: "gauge+number",
        gauge: {
          axis: { range: [0, 9] },
          steps: [
            { range: [0, 1], color: "lightgray" },
            { range: [1, 2], color: "lightyellow" },
            { range: [2, 3], color: "lightgreen" },
            { range: [3, 4], color: "lightblue" },
            { range: [4, 5], color: "lightcyan" },
            { range: [5, 6], color: "lightseagreen" },
            { range: [6, 7], color: "mediumseagreen" },
            { range: [7, 8], color: "forestgreen" },
            { range: [8, 9], color: "darkgreen" },
          ],
        },
      },
    ];

    var gaugeLayout = { width: 400, height: 300, margin: { t: 0, b: 0 } };

    Plotly.newPlot("gauge", gaugeData, gaugeLayout);
  });
}

// Dropdown changes option
function optionChanged(subjectId) {
  // Update charts when a  sample  selected
  updateCharts(subjectId);
  updateGaugeChart(subjectId);
}

// Dashboard initialised
init();
