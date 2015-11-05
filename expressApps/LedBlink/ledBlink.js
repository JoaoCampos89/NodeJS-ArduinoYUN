/**
 * Hello world with led blinking
 * copy to yun using scp
 * run node helloWorld.js
 *  check http://arduino.local:3000/ in our browser
 *  troubleshoouting - first require express and next the johnny-five
 */
var express = require('express');
var app = express();
var five = require("johnny-five");
var board = new five.Board({port:"/dev/ttyATH0"});

// instatiate led
var led = {};

// route to blink led
app.get('/', function (req, res) {

  // Blink every half second
  led.blink(500);
  res.send('Hello World!');
});

// when board ready initiates node server
board.on("ready", function() {
  // Create an Led on pin 13
  led = new five.Led(13);

  var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
  });


});
