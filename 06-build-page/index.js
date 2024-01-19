const fs = require('fs').promises;
const path = require('path');
const fileSys = require('fs')

const data = {
  destinationDirectory: path.resolve(__dirname, 'project-dist'),
  assetsDirectory: path.resolve(__dirname, 'project-dist', 'assets'),
  subAsset: path.resolve(__dirname, 'assets'),
  outputPath: path.resolve(__dirname, 'project-dist', 'style.css'),
  charset: 'utf-8',
  inputPath: path.resolve(__dirname, 'styles'),
  templateFile: path.resolve(__dirname, 'template.html'),
  componentsFolder: path.resolve(__dirname, 'components'),
  htmlFile: path.resolve(__dirname, 'project-dist', 'index.html')
};

async function readTemplateFile() {
  try {
    const templateContent = await fs.readFile(data.templateFile, data.charset);
    return templateContent;
  } catch (err) {
    console.error('Error reading template file:', err.message);
    throw err;
  }
}

async function extractTagNames(templateContent) {
  const regex = /{{(.*?)}}/g;
  const matches = [];
  let match;
  while ((match = regex.exec(templateContent)) !== null) {
    matches.push(match[1].trim());
  }
  return matches;
}

async function replaceTagsWithContent(templateContent, tagNames) {
  try {
    for (const tagName of tagNames) {
      const componentFilePath = path.join(data.componentsFolder, `${tagName}.html`);
      const componentContent = await fs.readFile(componentFilePath, data.charset);

      const tagRegex = new RegExp(`{{${tagName}}}`, 'g');
      templateContent = templateContent.replace(tagRegex, componentContent);
    }
    return templateContent;
  } catch (err) {
    console.error('Error replacing tags with content:', err.message);
    throw err;
  }
}

async function saveOutputIndexFile(outputContent) {
  try {
    await fs.writeFile(data.htmlFile, outputContent, data.charset);
  } catch (err) {
    console.error('Error saving output file:', err.message);
    throw err;
  }
}

const copyAssetDirectory = async (sourceDirectory, destinationDirectory) => {
  try {
    await fs.mkdir(destinationDirectory, {
      recursive: true
    });
    const fileNames = await fs.readdir(sourceDirectory);
    const copyFilePromises = fileNames.map(async (fileName) => {
      const sourcePath = path.join(sourceDirectory, fileName);
      const destinationPath = path.join(destinationDirectory, fileName);
      const stats = await fs.stat(sourcePath);
      if (stats.isFile()) {
        await fs.copyFile(sourcePath, destinationPath);
      } else if (stats.isDirectory()) {
        await copyAssetDirectory(sourcePath, destinationPath);
      }
    });
    await Promise.all(copyFilePromises);
  } catch (err) {
    console.error('Error:', err.message);
    throw err;
  }
};

async function createCssBundle() {
  try {
    const files = await fs.readdir(data.inputPath, {
      withFileTypes: true
    });
    const writeStream = fileSys.createWriteStream(data.outputPath, {
      encoding: data.charset
    });
    for (const file of files) {
      if (file.isFile() && path.extname(file.name) === '.css' && !file.isDirectory()) {
        const fileText = await fs.readFile(path.resolve(data.inputPath, file.name), data.charset);
        writeStream.write(`${fileText}\n`);
      }
    }
    writeStream.end();
  } catch (err) {
    console.log('Error: ', err.message);
  }
}

async function buildHTMLPage() {
  try {
    await fs.rm(data.destinationDirectory, { force: true, recursive: true });
    copyAssetDirectory(data.subAsset, data.assetsDirectory);
    createCssBundle();
    const templateContent = await readTemplateFile();
    const tagNames = await extractTagNames(templateContent);
    const outputContent = await replaceTagsWithContent(templateContent, tagNames);
    await saveOutputIndexFile(outputContent);
  } catch (err) {
    console.error('An error occurred:', err.message);
  }
}

buildHTMLPage();