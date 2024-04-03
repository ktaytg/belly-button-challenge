// Read the data from The url
const url = "https://static.bc-edx.com/data/dl-1-2/m14/lms/starter/samples.json";

    // Fetch the JSON data and console log it
    d3.json(url).then((data) => {
        console.log(data);
       

      // Use D3 Create dropdown menu with options
      let dropdown = d3.select("#selDataset")
        .selectAll("option")
        .data(data.names)
        .enter()
        .append("option")
        .text(function(x) {
          return x;
        })
    
      // Display first name on page load
      getData(data.names[0]);
      
    
      // Create Function 
      function getData(selected) {
        
        // Filter data for selected
        let selectedData = data.samples.filter(sample => sample.id === selected)[0];
        console.log(selectedData);
    
        // Make bar chart
        let barChart = [{
          x: selectedData.sample_values.slice(0,10).reverse(),
          y: selectedData.otu_ids.slice(0,10).map(otu_id => "OTU " + otu_id).reverse(),
          text: selectedData.otu_labels.slice(0,10).reverse(),
          orientation: "h",
          type: "bar"
        }];
    
        // Use Plotly to plot the data in a bar chart
        Plotly.newPlot("bar", barChart);
    
        // Update bubble chart  
        let bubbleTrace = {
          x: selectedData.otu_ids,
          y: selectedData.sample_values,
          mode: "markers",
          marker: {
            size: selectedData.sample_values,
            color: selectedData.otu_ids,
            colorscale: "Earth"
          },
            text: selectedData.otu_labels,
        };
        let bubbleData = [bubbleTrace];
    
        let bubbleLayout = {
          xaxis: {title: "OTU ID"},
        };
    
        // Use Plotly to plot the data in a bubble chart
        Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    
        // Add metadata for selected to #sample-metadata 
        let Metadata = data.metadata.find(meta => meta.id == selected);
        // Clear the child elements in div with id sample-metadata
        d3.select("#sample-metadata").html("");  
        // Iterate through the entries array
        for (let key in Metadata) { 
          d3.select("#sample-metadata")
          .append("h6")
          .text(`${key}: ${Metadata[key]}`);
    }
      }  
      // Call getData() when a change
      d3.select("#selDataset").on("change", function() {
        let selected = d3.select(this).property("value");
        getData(selected);
    
      })
    });  
        