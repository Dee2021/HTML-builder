const fs = require('fs/promises');
const path = require('path');


const sourceFolder = '04-copy-directory/files';
const destinationFolder = '04-copy-directory/files-copy';


async function copyFile(source, destination) {
  try {
    const fileContent = await fs.readFile(source);
    await fs.writeFile(destination, fileContent);
    console.log(`Copied: ${source} to ${destination}`);
  } catch (err) {
    console.error(`Error copying file ${source}: ${err.message}`);
  }
}


async function copyDir(source, destination) {
  try {

    const files = await fs.readdir(source);


    await fs.mkdir(destination, { recursive: true });


    const copyPromises = files.map(file => {
      const sourcePath = path.join(source, file);
      const destinationPath = path.join(destination, file);

      return fs.stat(sourcePath).then(stats => {
        if (stats.isFile()) {
          return copyFile(sourcePath, destinationPath);
        } else if (stats.isDirectory()) {
          return copyDir(sourcePath, destinationPath);
        }
      });
    });


    await Promise.all(copyPromises);
  } catch (err) {
    console.error(`Error copying directory ${source}: ${err.message}`);
  }
}


copyDir(sourceFolder, destinationFolder);
