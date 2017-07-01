const fs = require('fs');
const constants = require('../constants');

class ServerGenerator {
  constructor(thriftInfo) {
    this.thriftInfo = thriftInfo;
    this.output = fs.createWriteStream(`${constants.SrcDir}/server.js`);
  }

  generate() {
    this.output.write(
`const express = require('express');
const exphbs = require('express-handlebars');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const Controller = require('./controller.js');

const app = express();

const hbs = exphbs.create({
  defaultLayout: 'main',
  helpers: {
    ifeq: function(a, b, options) {
      if (a === b) {
        return options.fn(this);
      }
      return options.inverse(this);
    },
    toJSON : function(object) {
      return JSON.stringify(object);
    }
  }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

app.get('/', Controller.indexGet);
`
    );

    this.thriftInfo.functionNames.forEach(name => {
      this.output.write(
`
app.get('/${name}', Controller.${name}Get);
`
      );
    });

    this.output.write(
`
app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + app.get('port'));
});

module.exports = app;
`
    );
  }
}

module.exports = ServerGenerator;
