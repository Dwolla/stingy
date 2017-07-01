const fs = require('fs');
const constants = require('./lib/constants');
const thriftParser = require('./lib/thriftParser');
const PackageGenerator = require('./lib/generators/PackageGenerator');
const ClientGenerator = require('./lib/generators/ClientGenerator');
const ServerGenerator = require('./lib/generators/ServerGenerator');
const ControllerGenerator = require('./lib/generators/ControllerGenerator');
const ViewGenerator = require('./lib/generators/ViewGenerator');

function createSourceDirectory() {
  if (!fs.existsSync(constants.SrcDir)) {
      fs.mkdirSync(constants.SrcDir);
  }
}

// function writeParam(tFunc, thriftInfo) {
//   const arg = tFunc.args[0];
//
//   if (arg.type === 'string') {
//     clientStream.write(`const ${arg.name} = \'foobar\';`);
//   } else {
//     const argProps = thriftInfo.structs[arg.type];
//     clientStream.write(`const ${arg.name} = new ttypes.${arg.type}();\n`);
//
//     argProps.forEach(prop => {
//       if (prop.type === 'string') {
//         clientStream.write(`${arg.name}.${prop.name} = 'foobaz';\n`);
//       }
//     });
//   }
// }

const thriftInfo = thriftParser(process.argv.slice(2)[0]);

createSourceDirectory();

new PackageGenerator().generate();
new ClientGenerator(thriftInfo).generate();
new ServerGenerator(thriftInfo).generate();
new ControllerGenerator(thriftInfo).generate();
new ViewGenerator(thriftInfo).generate();

console.log('Generated some stuff for you to check out in the gen-src folder!');
