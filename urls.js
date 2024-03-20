const fs = require('fs');
const axios = require('axios');
const { URL } = require('url');

// Check if the filename is provided as an argument
if (process.argv.length !== 3) {
  console.error('Usage: node urls.js FILENAME');
  process.exit(1);
}

// Extract filename from command line arguments
const filename = process.argv[2];

// Read the file and process URLs
fs.readFile(filename, 'utf8', async (err, data) => {
  if (err) {
    console.error(`Error reading file: ${err}`);
    process.exit(1);
  }

  // Split file content by lines
  const urls = data.trim().split('\n');

  // Process each URL
  for (const url of urls) {
    try {
      // Send GET request to the URL
      const response = await axios.get(url);

      // Extract hostname from the URL
      const { hostname } = new URL(url);

      // Write HTML content to a file named after the hostname
      const outputFile = `${hostname}.html`;
      fs.writeFile(outputFile, response.data, (err) => {
        if (err) {
          console.error(`Error writing to file ${outputFile}: ${err}`);
        } else {
          console.log(`Saved HTML content of ${url} to ${outputFile}`);
        }
      });
    } catch (error) {
      console.error(`Error fetching URL ${url}: ${error}`);
    }
  }
});
