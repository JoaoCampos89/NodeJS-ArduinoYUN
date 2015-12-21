/**
 * Receives serial data from arduino micro to the yun linux
 * troubleshoouting - the yun cannot process all incoming serial data events and the serial blocks. The solution is concat the data events and check for the stop string
 * stream of bytes
 * see: https://github.com/voodootikigod/node-serialport/issues/402
 *
 */

var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs');
var fd;

var serialport = require("serialport");
var SerialPort = require("serialport").SerialPort;
var serialPort = new SerialPort("/dev/ttyATH0", {
  baudrate: 57600,
  bufferSize:5,
  platformOptions: {
    vmin: 100,
    vtime: 0
  },
// parser: serialport.parsers.readline("\n")
}, false); // this is the openImmediately flag [default is true]

var i=1;
var buffer = "";


serialPort.open(function(error) {
  if (error) {
    console.log('failed to open: ' + error);
  } else {
    console.log('serial port open: '+i);
    serialPort.write(i, function(err, results) {

      console.log('sending initial data: '+i);
    });

    serialPort.on('data', function(data) {
        buffer=buffer+data.toString("ascii");

        if(buffer.indexOf('\n') > -1){
          console.log("data completed: " + buffer);
          buffer="";
        }

      console.log('data received: ' + new Buffer(data).toString("ascii"));

      serialPort.write(i, function(err, results) {

        console.log('sending on Data: ' + i);
      });
    });

  }
});
