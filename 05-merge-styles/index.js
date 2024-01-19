const fs = require('fs/promises');
const path = require('path');


const sourceFolder = '05-merge-styles/styles';
const destinationFile = '05-merge-styles/project-dist/bundle.css';

async function compileStyles() {
  try {

    const files = await fs.readdir(sourceFolder);


    const cssFiles = files.filter(file => path.extname(file) === '.css');


    const stylesArray = [];

    for (const cssFile of cssFiles) {
      const filePath = path.join(sourceFolder, cssFile);
      const fileContent = await fs.readFile(filePath, 'utf-8');
      stylesArray.push(fileContent);
    }


    const bundledStyles = stylesArray.join('\n');


    await fs.writeFile(destinationFile, bundledStyles);

    console.log('Styles have been successfully bundled into bundle.css');
  } catch (err) {
    console.error(`Error compiling styles: ${err.message}`);
  }
}


compileStyles();
