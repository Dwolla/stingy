var thrift = require('thrift');
var ExampleService = require('../gen-nodejs/StingyExampleService');
var ttypes = require('../gen-nodejs/example_types');

var server = thrift.createServer(ExampleService, {
  DoSomethingSimple: function(foo, result) {
    console.log('DoSomethingSimple(', foo, ')');
    result(null, 'Hello, world!');
  },

  DoSomethingComplicated: function(request, result) {
    console.log('DoSomethingComplicated(', request, ')');
    var response = new ttypes.SomethingComplicatedResponse();
    response.success = true;
    response.message = "Hello, world!";
    result(null, response);
  }
});

server.listen(9090);
