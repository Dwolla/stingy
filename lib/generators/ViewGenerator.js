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
<link rel="stylesheet" href="public/css/main.min.css">
</head>
<body>
<nav class="navbar" role="navigation" aria-label="main navigation">
  <div class="container">
    <div class="navbar-brand">
      <a class="navbar-item" href="/">
        <strong>${this.thriftInfo.serviceName}</strong>
      </a>
    </div>
    <div class="navbar-menu">
      <div class="navbar-start">
        <div class="navbar-item has-dropdown is-hoverable">
          <a class="navbar-link" href="/">Methods</a>
          <div class="navbar-dropdown">
`);

this.thriftInfo.functionNames.forEach(name => {
  stream.write(
`
            <a class="navbar-item" href="/${name}">${name}</a>
`);
});

stream.write(
`         </div>
        </div>
      </div>
      <div class="navbar-end">
        <div class="navbar-item">
          Stingy UI
        </div>
      </div>
    </div>
  </div>
</nav>
{{{body}}}
</body>
</html>
`);
  }

  _writeIndex() {
    const stream = fs.createWriteStream(`${this.viewsDir}/index.handlebars`);

    stream.write(
`<section class="hero is-primary is-bold">
  <div class="hero-body">
    <div class="container">
        <h1 class="title">Available Methods</h1>
    </div>
  </div>
</section>
<section class="section">
  <div class="container">
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
  </div>
</section>
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

    // support arg.type = bool, enum, list, (optional vs required?)
    const isTextFieldArgType = arg => arg.type === 'string' || arg.type === 'i64' || arg.type === 'i32' || arg.type === 'i16';
    const isBooleanArgType = arg => arg.type === 'bool';

    const writeTextField = (name, htmlName, type) => {
      stream.write('<div class="field">\n');
      stream.write(`<label class="label" for="${htmlName}">${name} (${type})</label>\n`);
      stream.write(`<div class="control"><input class="input" name="${htmlName}" type="text"/></div>\n`);
      stream.write('</div>\n');
    };
    const writeBooleanField = (name, htmlName) => {
      stream.write('<div class="field">\n');
      stream.write(`<label class="label" for="${htmlName}">${name} (bool)</label>\n`);
      stream.write('<div class="control">\n');
      stream.write(`<label class="radio"><input type="radio" name="${htmlName}" value="value-true" />&nbsp;&nbsp;True</label>&nbsp;&nbsp;&nbsp;\n`);
      stream.write(`<label class="radio"><input type="radio" name="${htmlName}" value="value-false" />&nbsp;&nbsp;False</label>\n`);
      stream.write('</div>\n');
      stream.write('</div>\n');
    };
    const writeEnumField = (name, htmlName, typeName, enumType) => {
      stream.write('<div class="field">\n');
      stream.write(`<label class="label" for="${htmlName}">${name} (${typeName})</label>\n`);
      stream.write('<div class="control">\n');

      enumType.items.forEach(item => {
        stream.write(`<label class="radio"><input type="radio" name="${htmlName}" value="${item.value}" />&nbsp;&nbsp;${item.name}</label><br>\n`);
      });

      stream.write('</div>\n');
      stream.write('</div>\n');
    };

    stream.write(
`<section class="hero is-primary is-bold">
  <div class="hero-body">
    <div class="container">
      <h1 class="title">${name} Method</h1>
    </div>
  </div>
</section>

<section class="section">
  <div class="container">
    <div class="columns">
      <div class="column is-half">
        <form method="post">
`
    );

    if (isTextFieldArgType(arg)) {
      writeTextField(arg.name, arg.name, arg.type);
    } else if (isBooleanArgType(arg)) {
      writeBooleanField(arg.name, arg.name)
    } else {
      const enumType = this.thriftInfo.enums[arg.type];
      const structType = this.thriftInfo.structs[arg.type];

      if (enumType) {
        writeEnumField(arg.name, arg.name, arg.type, enumType);
      } else if (structType) {
        stream.write(`<h2 class="title is-4">${arg.name} (${arg.type})</h2>\n`);

        structType.forEach(subArg => {
          const subEnumType = this.thriftInfo.enums[subArg.type];

          if (isTextFieldArgType(subArg)) {
            writeTextField(subArg.name, `${arg.name}[${subArg.name}]`, subArg.type);
          } else if (isBooleanArgType(subArg)) {
            writeBooleanField(subArg.name, `${arg.name}[${subArg.name}]`);
          } else if (subEnumType) {
            writeEnumField(subArg.name, `${arg.name}[${subArg.name}]`, subArg.type, subEnumType);
          }
        });
      }
    }

    stream.write(
`         <div class="field--button">
            <button class="button is-primary is-medium">Call Method</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</section>
`
    );
  }
}

module.exports = ViewGenerator;
