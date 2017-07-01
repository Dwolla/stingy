const fs = require('fs');
const constants = require('../constants');

class ClientGenerator {
  constructor(thriftInfo) {
    this.thriftInfo = thriftInfo;
    this.output = fs.createWriteStream(`${constants.SrcDir}/client.js`);
  }

  generate() {
    this._writeThriftRequire();
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
    return fs.readdirSync(constants.ThriftGenFolder);
  }

  _isTypesFile(file) {
    return file.includes('_types.js');
  }

  _writeThriftRequire() {
    this.output.write('const thrift = require(\'thrift\');\n');
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

    this.client = thrift.createClient(Service, connection);
  }`
    );
  }

  _writeCall(tFunc) {
    const arg = tFunc.args[0];

    this.output.write(`

  ${tFunc.name}(${arg.name}) {
    this.client.${tFunc.name}(${arg.name}, (err, response) => {
      console.log('Calling ${tFunc.name}...');
      console.log(response);
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
