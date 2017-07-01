const fs = require('fs');
const thriftParser = require('thrift-parser');

function buildThriftInfo(thriftAst) {
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
}

function validate(thriftInfo) {
  thriftInfo.functionNames.forEach(name => {
    const tFunc = thriftInfo.functions[name];

    if (tFunc.args.len < 1) {
      throw new Exception('Thrift functions with no params are not supported yet');
    }
    if (tFunc.args.len > 1) {
      throw new Exception('Thrift functions with more than one param are not supported yet');
    }
  });
}

module.exports = (filename) => {
  const thriftInfo = buildThriftInfo(thriftParser(fs.readFileSync(filename)));
  validate(thriftInfo);
  return thriftInfo;
};
