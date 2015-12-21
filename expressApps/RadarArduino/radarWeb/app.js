/**
 * control the robot using arduino yun
 * Giving the blinking information with socket io
 * copy to yun using scp
 * run node robot.js
 *  check http://arduino.local:3000/ in our browser
 *  troubleshoouting - first require express and next the johnny-five
 *  troubleshoouting - edit usr/bin/node in yun with the following line:
 *  NODE_PATH=/usr/lib/node_modules /usr/bin/nodejs $@
 *  Allowing to node use all memory
 *  cd arduino/wwww
 *
 */


var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
SerialPort = require("serialport").SerialPort;
portName = "COM15";
val = "";
sp = new SerialPort(portName, {
  baudrate: 9600
});



app.use('/static', express.static(__dirname + '/public'));


// serve index
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// set led with value change in slider
io.on('connection', function(socket) {
  socket.on("message", function(data) {
    return console.log(data);
  });
  return socket.on("disconnect", function() {
    return console.log("disconnected");
  });


});

sp.on("close", function(err) {
  return console.log("port closed");
});
sp.on("error", function(err) {
  return console.error("error", err);
});
sp.on("open", function() {
  http.listen(3000, function() {
    console.log('listening on *:3000');
  });

  return console.log("Arduino connected.");

});
sp.on("data", function(data) {
  val += data.toString();
  if (val.substr(val.length - 1, 1) === "}") {
    io.sockets.emit("message", val);
    console.log(val);
    val = "";
    return val;
  }
});
