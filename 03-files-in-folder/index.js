const fs = require('fs/promises');
const path = require('path');


const folderPath = '03-files-in-folder/secret-folder';


async function displayFileInfo(file) {
  try {

    const fileExt = path.extname(file.name);


    const stats = await fs.stat(path.join(folderPath, file.name));


    console.log(`${file.name} - ${fileExt.slice(1)} - ${stats.size}B`);
  } catch (err) {
    console.error(`Error reading file ${file.name}: ${err.message}`);
  }
}


async function processFiles() {
  try {

    const files = await fs.readdir(folderPath, { withFileTypes: true });


    const filePromises = files
      .filter(file => file.isFile())
      .map(displayFileInfo);


    await Promise.all(filePromises);
  } catch (err) {
    console.error(`Error reading folder ${folderPath}: ${err.message}`);
  }
}


processFiles();
