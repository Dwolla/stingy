# Stingy

An automatically generated web UI for Thrift interfaces.

_Current limitations:_
This is a proof of concept. It's limited to a single parameter in each Thrift function.
That parameter can either be a string, or an object containing string fields. More
support for everything else to come later.

## Prereqs

* Apache Thrift must be installed and on your path
* Run `npm install`

## To run generator for provided example service

`npm start`

## To run generator for your own thrift file

`node generator.js {path-to-thrift-file}`

## Output

The output directory is currently hardcoded to be one directory back and in a new folder:
`../gen-src`
