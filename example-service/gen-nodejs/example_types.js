//
// Autogenerated by Thrift Compiler (0.10.0)
//
// DO NOT EDIT UNLESS YOU ARE SURE THAT YOU KNOW WHAT YOU ARE DOING
//
"use strict";

var thrift = require('thrift');
var Thrift = thrift.Thrift;
var Q = thrift.Q;


var ttypes = module.exports = {};
ttypes.SomeEnum = {
  'ENUM_ONE' : 0,
  'ENUM_TWO' : 2,
  'ENUM_THREE' : 4,
  'ENUM_FOUR' : 5
};
var SomethingComplicatedRequest = module.exports.SomethingComplicatedRequest = function(args) {
  this.foo = null;
  this.bar = null;
  this.baz = null;
  this.pok = null;
  if (args) {
    if (args.foo !== undefined && args.foo !== null) {
      this.foo = args.foo;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field foo is unset!');
    }
    if (args.bar !== undefined && args.bar !== null) {
      this.bar = args.bar;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field bar is unset!');
    }
    if (args.baz !== undefined && args.baz !== null) {
      this.baz = args.baz;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field baz is unset!');
    }
    if (args.pok !== undefined && args.pok !== null) {
      this.pok = args.pok;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field pok is unset!');
    }
  }
};
SomethingComplicatedRequest.prototype = {};
SomethingComplicatedRequest.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.STRING) {
        this.foo = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.I16) {
        this.bar = input.readI16();
      } else {
        input.skip(ftype);
      }
      break;
      case 3:
      if (ftype == Thrift.Type.BOOL) {
        this.baz = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 4:
      if (ftype == Thrift.Type.I32) {
        this.pok = input.readI32();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

SomethingComplicatedRequest.prototype.write = function(output) {
  output.writeStructBegin('SomethingComplicatedRequest');
  if (this.foo !== null && this.foo !== undefined) {
    output.writeFieldBegin('foo', Thrift.Type.STRING, 1);
    output.writeString(this.foo);
    output.writeFieldEnd();
  }
  if (this.bar !== null && this.bar !== undefined) {
    output.writeFieldBegin('bar', Thrift.Type.I16, 2);
    output.writeI16(this.bar);
    output.writeFieldEnd();
  }
  if (this.baz !== null && this.baz !== undefined) {
    output.writeFieldBegin('baz', Thrift.Type.BOOL, 3);
    output.writeBool(this.baz);
    output.writeFieldEnd();
  }
  if (this.pok !== null && this.pok !== undefined) {
    output.writeFieldBegin('pok', Thrift.Type.I32, 4);
    output.writeI32(this.pok);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

var SomethingComplicatedResponse = module.exports.SomethingComplicatedResponse = function(args) {
  this.success = null;
  this.message = null;
  if (args) {
    if (args.success !== undefined && args.success !== null) {
      this.success = args.success;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field success is unset!');
    }
    if (args.message !== undefined && args.message !== null) {
      this.message = args.message;
    } else {
      throw new Thrift.TProtocolException(Thrift.TProtocolExceptionType.UNKNOWN, 'Required field message is unset!');
    }
  }
};
SomethingComplicatedResponse.prototype = {};
SomethingComplicatedResponse.prototype.read = function(input) {
  input.readStructBegin();
  while (true)
  {
    var ret = input.readFieldBegin();
    var fname = ret.fname;
    var ftype = ret.ftype;
    var fid = ret.fid;
    if (ftype == Thrift.Type.STOP) {
      break;
    }
    switch (fid)
    {
      case 1:
      if (ftype == Thrift.Type.BOOL) {
        this.success = input.readBool();
      } else {
        input.skip(ftype);
      }
      break;
      case 2:
      if (ftype == Thrift.Type.STRING) {
        this.message = input.readString();
      } else {
        input.skip(ftype);
      }
      break;
      default:
        input.skip(ftype);
    }
    input.readFieldEnd();
  }
  input.readStructEnd();
  return;
};

SomethingComplicatedResponse.prototype.write = function(output) {
  output.writeStructBegin('SomethingComplicatedResponse');
  if (this.success !== null && this.success !== undefined) {
    output.writeFieldBegin('success', Thrift.Type.BOOL, 1);
    output.writeBool(this.success);
    output.writeFieldEnd();
  }
  if (this.message !== null && this.message !== undefined) {
    output.writeFieldBegin('message', Thrift.Type.STRING, 2);
    output.writeString(this.message);
    output.writeFieldEnd();
  }
  output.writeFieldStop();
  output.writeStructEnd();
  return;
};

