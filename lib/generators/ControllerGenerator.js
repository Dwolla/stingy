const fs = require('fs');
const constants = require('../constants');

class ControllerGenerator {
  constructor(thriftInfo) {
    this.thriftInfo = thriftInfo;
    this.output = fs.createWriteStream(`${constants.SrcDir}/controller.js`);
    this.viewsDir = `${constants.SrcDir}/views`;

    if (!fs.existsSync(this.viewsDir)) {
        fs.mkdirSync(this.viewsDir);
    }
  }

  generate() {
    this._writeRequire();
    this._writeIndex();
    this._writeFunctions();
  }

  _writeRequire() {
    this.output.write(
`const TClient = require(\'./client\');
const client = new TClient('localhost', 9090);
`
    );
  }

  _writeIndex() {
    this.output.write(`
exports.indexGet = function (req, res) {
  res.render('index', {
    title: 'Stingy - Choose a function'
  });
};
`
    );
  }

  _writeFunctions() {
    this.thriftInfo.functionNames.forEach(name => {
      this.output.write(
`
exports.${name}Get = function(req, res) {
  res.render('${name}', {
    title: 'Stingy - Call function ${name}'
  });
};

exports.${name}Post = function(req, res) {
  client.${name}(req.body)
    .then((response) => {
      res.send(response);
    });
};
`
      );
    });
  }
}

module.exports = ControllerGenerator;
