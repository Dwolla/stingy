var thrift = require('thrift');
var ExampleService = require('./gen-nodejs/StingyExampleService');
var ttypes = require('./gen-nodejs/example_types');

var server = thrift.createServer(ExampleService, {
  DoSomethingSimple: function(foo, result) {
    console.log('DoSomethingSimple(', foo, ')');
    result(null, `You sent: '${foo}'`);
  },

  DoSomethingComplicated: function(request, result) {
    console.log('DoSomethingComplicated(', request, ')');
    var response = new ttypes.SomethingComplicatedResponse();
    response.success = true;
    response.message = `You sent: foo='${request.foo}' bar='${request.bar}'`;
    result(null, response);
  }
});

const port = 9090;
console.log(`Starting server on port ${port}`);
server.listen(port);
