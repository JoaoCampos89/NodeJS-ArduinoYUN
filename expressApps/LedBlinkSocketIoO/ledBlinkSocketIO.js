/**
 * control the led blinking
 * Blinking the led in arduino yun with socket io events
 * copy to yun using scp
 * run node ledBlinkSocketIO.js
 *  check http://arduino.local:3000/ in our browser
 *  troubleshoouting - first require express and next the johnny-five
 *  troubleshoouting - edit usr/bin/node in yun with the following line:
 *  NODE_PATH=/usr/lib/node_modules /usr/bin/nodejs $@
 *  Allowing to node use all memory
 *  cd arduino/wwww
 *
 */


 var express = require('express');
 var app = express();
 var http = require('http').Server(app);
 var io = require('socket.io')(http);
 var five = require("johnny-five");
 var board = new five.Board({port:"/dev/ttyATH0"});

 // instatiate led
 var led = {};

 // serve index
 app.get('/', function (req, res) {
   res.sendFile(__dirname + '/index.html');
 });

// set led with value change in slider and emit val
 io.on('connection', function(socket){
   console.log('a user connected');
   socket.on('Set Led', function(val){
     led.blink(parseInt(val));
     io.emit('changedLed', parseInt(val));
   });
 });

 // when board ready initiates node server
 board.on("ready", function() {
   // Create an Led on pin 13
   led = new five.Led(13);

  /*
    initiate the server at port 3000

   */

   http.listen(3000, function(){
        console.log('listening on *:3000');
      });


 });
