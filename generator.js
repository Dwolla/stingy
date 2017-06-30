const thrift = require('thrift');
const thriftParser = require('thrift-parser');
const fs = require('fs');

const ThriftGenFolder = './gen-nodejs';
const SrcDir = './gen-src';

function getThriftAst() {
  const thriftDef = fs.readFileSync(process.argv.slice(2)[0]);
  return thriftParser(thriftDef);
}

function createSourceDirectory() {
  if (!fs.existsSync(SrcDir)) {
      fs.mkdirSync(SrcDir);
  }
}

function stripJsExt(file) {
  return file.replace('.js', '');
}

function writeRequire(name, file) {
  clientStream.write(`const ${name} = require(\'../gen-nodejs/${stripJsExt(file)}\');\n`);
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
  assert(false, err);
});

const client = thrift.createClient(Service, connection);

`
  );
}

function isTypesFile(file) {
  return file.includes('_types.js');
}

function requireHelper(file) {
  return require(`${ThriftGenFolder}/${file}`);
}

function writeParam(tFunc, thriftAst) {
  const arg = tFunc.args[0];

  if (arg.type === 'string') {
    clientStream.write(`const ${arg.name} = \'foobar\';`);
  } else {
    const argProps = thriftAst.struct[arg.type];
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

const thriftAst = getThriftAst();

createSourceDirectory();
const clientStream = fs.createWriteStream(`${SrcDir}/client.js`);

writeThriftRequire();

fs.readdirSync(ThriftGenFolder).forEach(file => {
  if (isTypesFile(file)) {
    writeRequire('ttypes', file);
  } else {
    writeRequire('Service', file);
  }
});

writeClient();

const serviceName = Object.keys(thriftAst.service)[0];
const functions = thriftAst.service[serviceName].functions;
const functionNames = Object.keys(functions);

functionNames.forEach(name => {
  const tFunc = functions[name];
  if (tFunc.args.len < 1) {
    throw new Exception('Thrift functions with no params are not supported yet');
  }
  if (tFunc.args.len > 1) {
    throw new Exception('Thrift functions with more than one param are not supported yet');
  }

  writeParam(tFunc, thriftAst);
  writeCall(tFunc);
});

console.log('Generated some stuff for you to check out in the gen-src folder!');
