const fs = require('fs-extra');
const constants = require('./constants');

exports.copy = () => {
  fs.copySync('./assets', `${constants.SrcDir}/public`);
};
