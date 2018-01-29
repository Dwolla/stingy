# Stingy - A UI for Thrift

[![license](https://img.shields.io/github/license/Dwolla/stingy.svg?style=flat-square)]()

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

## Modifying the Example Thrift Service

An example service to test against is located in the `example-service` folder. After making a change to `example.thrift`,
run the following command to generate an update node client:

`thrift -r --gen js:node example.thrift`

After updating the client, implement the updates and/or new methods in `server.js`.