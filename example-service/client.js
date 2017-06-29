var thrift = require('thrift');
var ExampleService = require('../gen-nodejs/StingyExampleService');
var ttypes = require('../gen-nodejs/example_types');

var transport = thrift.TBufferedTransport;
var protocol = thrift.TBinaryProtocol;

var connection = thrift.createConnection("localhost", 9090, {
  transport : transport,
  protocol : protocol
});

connection.on('error', function(err) {
  assert(false, err);
});

var client = thrift.createClient(ExampleService, connection);

client.DoSomethingSimple('hey hey', function(err, response) {
  console.log('Calling DoSomethingSimple...');
  console.log(response);
});

var request = new ttypes.SomethingComplicatedRequest();
request.foo = 'hey foo';
request.bar = 'hey bar';

client.DoSomethingComplicated(request, function(err, response) {
  console.log('Calling DoSomethingComplicated...');
  console.log(response);
});
