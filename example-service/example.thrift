struct SomethingComplicatedRequest {
  1: required string foo;
  2: required string bar;
}

struct SomethingComplicatedResponse {
  1: required bool success;
  2: required string message;
}

service StingyExampleService {
  string DoSomethingSimple(1: required string foo)
  SomethingComplicatedResponse DoSomethingComplicated(1: required SomethingComplicatedRequest request)
}
