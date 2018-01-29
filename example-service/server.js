var thrift = require('thrift');
var ExampleService = require('./gen-nodejs/StingyExampleService');
var ttypes = require('./gen-nodejs/example_types');

var server = thrift.createServer(ExampleService, {
  DoSomethingSimple: function(foo, result) {
    console.log('DoSomethingSimple(', foo, ')');
    result(null, `You sent: '${foo}'`);
  },

  DoSomethingWithAnInt: function(someInt, result) {
    console.log('DoSomethingWithAnInt(', someInt, ')');
    result(null, `You sent: '${someInt}'`);
  },

  DoSomethingWithABool: function(someBool, result) {
    console.log('DoSomethingWithABool(', someBool, ')');
    result(null, someBool);
  },

  DoSomethingComplicated: function(request, result) {
    console.log('DoSomethingComplicated(', request, ')');
    var response = new ttypes.SomethingComplicatedResponse();
    response.success = true;
    response.message = `You sent: foo='${request.foo}' bar='${request.bar}' baz='${request.baz}'`;
    result(null, response);
  }
});

const port = 9090;
console.log(`Starting server on port ${port}`);
server.listen(port);
