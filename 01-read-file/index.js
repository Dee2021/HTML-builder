// const fs = require('fs');
// const path = require('path');
// const { stdout } = require('process');
// const input = fs.createReadStream(path.join(__dirname, 'text.txt'), 'utf-8');
// input.on('data', data => stdout.write(data));



const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(filePath);
readStream.pipe(process.stdout);
readStream.on('error', (err) => {
  console.error(`Error reading the file: ${err.message}`);
});