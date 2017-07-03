const fs = require('fs');
const cp = require('child_process');
const constants = require('./lib/constants');
const thriftParser = require('./lib/thriftParser');
const PackageGenerator = require('./lib/generators/PackageGenerator');
const ClientGenerator = require('./lib/generators/ClientGenerator');
const ServerGenerator = require('./lib/generators/ServerGenerator');
const ControllerGenerator = require('./lib/generators/ControllerGenerator');
const ViewGenerator = require('./lib/generators/ViewGenerator');
const BootstrapFileGenerator = require('./lib/generators/BootstrapFileGenerator');

function getFileNameFromArgs() {
  return process.argv.slice(2)[0];
}

function generateNodeJsClient(filename, dest) {
  cp.execSync(`thrift -r -o ${dest} --gen js:node ${filename}`);
}

function createSourceDirectory() {
  if (!fs.existsSync(constants.SrcDir)) {
      fs.mkdirSync(constants.SrcDir);
  }
}

const filename = getFileNameFromArgs();
const thriftInfo = thriftParser(filename);

createSourceDirectory();
generateNodeJsClient(filename, constants.SrcDir);

new PackageGenerator().generate();
new ClientGenerator(thriftInfo).generate();
new ServerGenerator(thriftInfo).generate();
new ControllerGenerator(thriftInfo).generate();
new ViewGenerator(thriftInfo).generate();
new BootstrapFileGenerator().generate();

console.log('Generated some stuff for you to check out in the gen-src folder!');

console.log('Bootstrapping server...');
cp.fork(`${constants.SrcDir}/bootstrap.js`, [], {cwd: `${constants.SrcDir}`});
