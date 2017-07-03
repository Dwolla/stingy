const fs = require('fs');
const constants = require('../constants');

class BootstrapFileGenerator {
  constructor() {
    this.output = fs.createWriteStream(`${constants.SrcDir}/bootstrap.js`);
  }

  generate() {
    this.output.write(
`const cp = require('child_process');

console.log('\\nInstalling dependencies...');
cp.execSync('npm install');

console.log('\\nStarting server...');
cp.fork('server.js');
`
    );
  }
}

module.exports = BootstrapFileGenerator;
