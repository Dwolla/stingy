const thrift = require('thrift');
const ExampleService = require('../gen-nodejs/StingyExampleService');
const ttypes = require('../gen-nodejs/example_types');

const connection = thrift.createConnection("localhost", 9090, {
  transport : thrift.TBufferedTransport,
  protocol : thrift.TBinaryProtocol
});

connection.on('error', function(err) {
  assert(false, err);
});

const client = thrift.createClient(ExampleService, connection);

client.DoSomethingSimple('hey hey', (err, response) => {
  console.log('Calling DoSomethingSimple...');
  console.log(response);
});

var request = new ttypes.SomethingComplicatedRequest();
request.foo = 'hey foo';
request.bar = 'hey bar';

client.DoSomethingComplicated(request, (err, response) => {
  console.log('Calling DoSomethingComplicated...');
  console.log(response);
});
