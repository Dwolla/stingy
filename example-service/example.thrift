struct SomethingComplicatedRequest {
  1: required string foo;
  2: required i16 bar;
  3: required bool baz;
}

struct SomethingComplicatedResponse {
  1: required bool success;
  2: required string message;
}

service StingyExampleService {
  string DoSomethingSimple(1: required string foo)
  string DoSomethingWithAnInt(1: required i64 someInt)
  bool DoSomethingWithABool(1: required bool someBool)
  SomethingComplicatedResponse DoSomethingComplicated(1: required SomethingComplicatedRequest request)
}
