const fs = require('fs');
const thriftParser = require('thrift-parser');

module.exports = (file) => {
  const thriftDef = fs.readFileSync(file);
  const thriftAst = thriftParser(thriftDef);

  const serviceName = Object.keys(thriftAst.service)[0];
  const functions = thriftAst.service[serviceName].functions;
  const functionNames = Object.keys(functions);
  const structs = thriftAst.struct;

  return {
    serviceName,
    functionNames,
    functions,
    structs
  };
};
