const thrift = require('thrift');
const fs = require('fs');
const constants = require('./lib/constants');
const thriftParser = require('./lib/thriftParser');
const PackageGenerator = require('./lib/PackageGenerator');
const ServerGenerator = require('./lib/ServerGenerator');
const ControllerGenerator = require('./lib/ControllerGenerator');
const ViewGenerator = require('./lib/ViewGenerator');

function createSourceDirectory() {
  if (!fs.existsSync(constants.SrcDir)) {
      fs.mkdirSync(constants.SrcDir);
  }
}

function stripJsExt(file) {
  return file.replace('.js', '');
}

function writeRequire(name, file) {
  clientStream.write(`const ${name} = require(\'./gen-nodejs/${stripJsExt(file)}\');\n`);
}

function writeThriftRequire() {
  clientStream.write('const thrift = require(\'thrift\');\n');
}

function writeClient() {
  clientStream.write(`
const connection = thrift.createConnection("localhost", 9090, {
  transport : thrift.TBufferedTransport,
  protocol : thrift.TBinaryProtocol
});

connection.on('error', function(err) {
  //assert(false, err);
});

const client = thrift.createClient(Service, connection);

`
  );
}

function isTypesFile(file) {
  return file.includes('_types.js');
}

function requireHelper(file) {
  return require(`${constants.ThriftGenFolder}/${file}`);
}

function writeParam(tFunc, thriftInfo) {
  const arg = tFunc.args[0];

  if (arg.type === 'string') {
    clientStream.write(`const ${arg.name} = \'foobar\';`);
  } else {
    const argProps = thriftInfo.structs[arg.type];
    clientStream.write(`const ${arg.name} = new ttypes.${arg.type}();\n`);

    argProps.forEach(prop => {
      if (prop.type === 'string') {
        clientStream.write(`${arg.name}.${prop.name} = 'foobaz';\n`);
      }
    });
  }
}

function writeCall(tFunc) {
  const arg = tFunc.args[0];

  clientStream.write(`
client.${tFunc.name}(${arg.name}, (err, response) => {
  console.log('Calling ${tFunc.name}...');
  console.log(response);
});

`
  )
}

const thriftInfo = thriftParser(process.argv.slice(2)[0]);

createSourceDirectory();
const clientStream = fs.createWriteStream(`${constants.SrcDir}/client.js`);

writeThriftRequire();

fs.readdirSync(constants.ThriftGenFolder).forEach(file => {
  if (isTypesFile(file)) {
    writeRequire('ttypes', file);
  } else {
    writeRequire('Service', file);
  }
});

writeClient();

thriftInfo.functionNames.forEach(name => {
  const tFunc = thriftInfo.functions[name];
  if (tFunc.args.len < 1) {
    throw new Exception('Thrift functions with no params are not supported yet');
  }
  if (tFunc.args.len > 1) {
    throw new Exception('Thrift functions with more than one param are not supported yet');
  }

  writeParam(tFunc, thriftInfo);
  writeCall(tFunc);
});

const pg = new PackageGenerator();
pg.generate();

const sg = new ServerGenerator(thriftInfo);
sg.generate();

const cg = new ControllerGenerator(thriftInfo);
cg.generate();

const vg = new ViewGenerator(thriftInfo);
vg.generate();

console.log('Generated some stuff for you to check out in the gen-src folder!');
