const fs = require('fs');
const constants = require('./constants');

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
    this._writeMainView();
    this._writeIndexView();
  }

  _writeRequire() {
    this.output.write('const TClient = require(\'./client\');\n');
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

  _writeIndexView() {
    const stream = fs.createWriteStream(`${this.viewsDir}/index.handlebars`);

    stream.write(
`<h1>Stingy - A UI for Thrift service testing</h1>
<h2>Here's a list of the methods in your service:</h2>
<ul>
`
    );

    this.thriftInfo.functionNames.forEach(name => {
      stream.write(
`
<li>
  <a href="/${name}">${name}</a>
</li>
`);
    });

    stream.write(
`
</ul>
`
    );
  }

  _writeMainView() {
    const layoutsDir = `${this.viewsDir}/layouts`;
    if (!fs.existsSync(layoutsDir)) {
        fs.mkdirSync(layoutsDir);
    }

    const stream = fs.createWriteStream(`${layoutsDir}/main.handlebars`);

    stream.write(
`
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Stingy</title>
<title>{{title}}</title>
<link rel="stylesheet" href="/css/main.css">
</head>
<body>
{{{body}}}
</body>
</html>
`
    );
  }
}

module.exports = ControllerGenerator;
