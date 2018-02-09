enum SomeEnum {
  ENUM_ONE,
  ENUM_TWO = 2,
  ENUM_THREE = 4,
  ENUM_FOUR
}

struct SomethingComplicatedRequest {
  1: required string foo;
  2: required i16 bar;
  3: required bool baz;
  4: required SomeEnum pok;
}

struct SomethingComplicatedResponse {
  1: required bool success;
  2: required string message;
}

service StingyExampleService {
  string DoSomethingSimple(1: required string foo)
  string DoSomethingWithAnInt(1: required i64 someInt)
  bool DoSomethingWithABool(1: required bool someBool)
  SomeEnum DoSomethingWithAnEnum(1: required SomeEnum someEnum)
  SomethingComplicatedResponse DoSomethingComplicated(1: required SomethingComplicatedRequest request)
}
