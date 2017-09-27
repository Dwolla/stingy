const fs = require('fs');
const constants = require('../constants');

class ClientGenerator {
  constructor(thriftInfo) {
    this.thriftInfo = thriftInfo;
    this.output = fs.createWriteStream(`${constants.SrcDir}/client.js`);
  }

  generate() {
    this._writePackageRequires();
    this._writeClientRequires();
    this._writeClient();

    this.thriftInfo.functionNames.forEach(name => {
      this._writeCall(this.thriftInfo.functions[name]);
    });

    this._writeExport();
  }

  _stripJsExt(file) {
    return file.replace('.js', '');
  }

  _getClientFilesList() {
    return fs.readdirSync(`${constants.SrcDir}/${constants.ThriftGenFolder}`);
  }

  _isTypesFile(file) {
    return file.includes('_types.js');
  }

  _writePackageRequires() {
    this.output.write(
`const thrift = require(\'thrift\');
const Promise = require(\'bluebird\');
`
    );
  }

  _writeRequire(name, file) {
    this.output.write(`const ${name} = require(\'./gen-nodejs/${this._stripJsExt(file)}\');\n`);
  }

  _writeClientRequires() {
    this._getClientFilesList().forEach(file => {
      if (this._isTypesFile(file)) {
        this._writeRequire('ttypes', file);
      } else {
        this._writeRequire('Service', file);
      }
    });
  }

  _writeClient() {
    this.output.write(`
class Client {
  constructor(serviceUrl, port) {
    const connection = thrift.createConnection(serviceUrl, port, {
      transport : thrift.TBufferedTransport,
      protocol : thrift.TBinaryProtocol
    });

    connection.on('error', function(err) {
      //assert(false, err);
    });

    this.client = Promise.promisifyAll(thrift.createClient(Service, connection));
  }`
    );
  }

  _writeCall(tFunc) {
    const arg = tFunc.args[0];
    var argName = null;

    this.output.write(`

  ${tFunc.name}(json) {
`
    );

    if (arg.type === 'string') {
      argName = `json.${arg.name}`;
    } else if (arg.type === 'i64' || arg.type === 'i32' || arg.type === 'i16') {
      argName = `parseInt(json.${arg.name})`;
    } else {
      argName = arg.name;
      this.output.write(`    const ${arg.name} = new ttypes.${arg.type}(json.${arg.name});\n`);
    }

    this.output.write(
`    return this.client.${tFunc.name}Async(${argName})
      .then((response) => {
        console.log('Calling ${tFunc.name}...');
        return response;
      });
  }`
    )
  }

  _writeExport() {
    this.output.write(
`
}

module.exports = Client;
`
    );
  }
}

module.exports = ClientGenerator;
