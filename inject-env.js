const fs = require('fs');
const path = require('path');

// Load angular.json to determine the project name from "projects" section
const angularConfig = JSON.parse(fs.readFileSync('angular.json', 'utf8'));
const projectName = Object.keys(angularConfig.projects)[0]; // Gets the first project key (in your case "envtest")

// Path to the built index.html file
const indexPath = path.join(__dirname, 'dist', projectName, 'browser', 'index.html');

// Inject the script tag into index.html
const injectEnvScript = () => {
  try {
    // Read the index.html file
    let indexHtml = fs.readFileSync(indexPath, 'utf8');
    
    // Check if env.js is already injected to avoid duplicates
    if (!indexHtml.includes('<script src="env.js"></script>')) {
      // Inject the env.js script tag before the closing </body> tag
      indexHtml = indexHtml.replace(
        '</body>',
        '<script src="env.js"></script>\n</body>'
      );

      // Write the updated index.html file
      fs.writeFileSync(indexPath, indexHtml, 'utf8');
      console.log('Successfully injected env.js into index.html');
    } else {
      console.log('env.js is already injected in index.html');
    }
  } catch (error) {
    console.error('Error injecting env.js into index.html:', error);
  }
};

// Get all environment variables
const envVars = process.env;

// Convert the environment variables to a JS object string
const envFileContent = `window.env = ${JSON.stringify(envVars)};`;

// Write the env.js file in the dist/projectname directory
const envFilePath = path.join(__dirname, 'dist', projectName, 'env.js');
fs.writeFileSync(envFilePath, envFileContent, 'utf8');

// Inject env.js into index.html
injectEnvScript();
