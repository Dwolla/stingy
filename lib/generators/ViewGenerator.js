const fs = require('fs');
const constants = require('../constants');

class ViewGenerator {
  constructor(thriftInfo) {
    this.thriftInfo = thriftInfo;
    this.viewsDir = `${constants.SrcDir}/views`;

    if (!fs.existsSync(this.viewsDir)) {
        fs.mkdirSync(this.viewsDir);
    }
  }

  generate() {
    this._writeMain();
    this._writeIndex();
    this._writeFunctions();
  }

  _writeMain() {
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

  _writeIndex() {
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

  _writeFunctions() {
    this.thriftInfo.functionNames.forEach(name => {
      this._writeFunction(name);
    });
  }

  _writeFunction(name) {
    const stream = fs.createWriteStream(`${this.viewsDir}/${name}.handlebars`);
    const tFunc = this.thriftInfo.functions[name];
    const arg = tFunc.args[0];

    const isTextFieldArgType = arg => arg.type === 'string' || arg.type === 'i64' || arg.type === 'i32' || arg.type === 'i16';
    const writeTextField = (name, htmlName, type) => {
      stream.write('<p>\n');
      stream.write(`<label for="${htmlName}">${name} (${type})</label><br/>\n`);
      stream.write(`<input name="${htmlName}" type="text"/>\n`);
      stream.write('</p>\n');
    };

    stream.write(
`<h1>Stingy - A UI for Thrift service testing</h1>
<h2>Try out a call to ${name}</h2>

<form method="post">
`
    );

    if (isTextFieldArgType(arg)) {
      writeTextField(arg.name, arg.name, arg.type);
    } else {
      const argProps = this.thriftInfo.structs[arg.type];
      stream.write(`<h3>Param &quot;${arg.name}&quot; of type ${arg.type}</h3>\n`);

      argProps.forEach(prop => {
        if (isTextFieldArgType(prop)) {
          writeTextField(prop.name, `${arg.name}[${prop.name}]`, prop.type);
        }
      });
    }



    stream.write(
`<input type="submit" />
</form>

<p>
  <a href="/">Back to index</a>
</p>
`
    );
  }
}

module.exports = ViewGenerator;
