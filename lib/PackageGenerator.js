const fs = require('fs');
const constants = require('./constants');

class PackageGenerator {
  constructor() {
    this.output = fs.createWriteStream(`${constants.SrcDir}/package.json`);
  }

  generate() {
    this.output.write(
`{
  "name": "stingy-gen",
  "version": "0.0.1",
  "description": "A UI for Thrift interface testing",
  "main": "index.js",
  "dependencies": {
    "body-parser": "^1.17.2",
    "express": "^4.15.3",
    "express-handlebars": "^3.0.0",
    "method-override": "^2.3.9",
    "thrift": "^0.10.0"
  }
}
`
    );
  }
}

module.exports = PackageGenerator;
