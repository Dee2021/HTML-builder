const fs = require('fs');
const readline = require('readline');


const filePath = '02-write-file/output.txt';


const writeStream = fs.createWriteStream(filePath, { flags: 'a' });


const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});


console.log('Welcome! Enter text (type "exit" to quit):');


rl.on('line', (input) => {

  if (input.toLowerCase() === 'exit') {
 
    console.log('Goodbye!');

    writeStream.end(() => process.exit());
  } else {

    writeStream.write(`${input}\n`);
  }
});


process.on('SIGINT', () => {

  console.log('\nGoodbye!');

  writeStream.end(() => process.exit());
});


process.on('exit', () => {

  rl.close();
});
