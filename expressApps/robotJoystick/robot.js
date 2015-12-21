/**
 * control the robot using arduino yun
 * the robot is controlled by a virtual joystick https://github.com/jeromeetienne/virtualjoystick.js via socket
 * run node robot.js
 *  check http://arduino.local:3000/ in our browser
 *  
 *
 */


var express = require('express');
var path = require('path');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var five = require("johnny-five");
var board = new five.Board({
  port: "/dev/ttyATH0"
});



app.use('/static', express.static(__dirname + '/public'));

// instatiate motorLeft
var motorLeft = {};
var motorRigth = {};

var maxDeltaY = 255;
var maxDeltaX = 255;
var gainY = 1;
var gainX =  1;


// serve index
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// set led with value change in slider
io.on('connection', function(socket) {
  console.log('a user connected');
// receives the joystick values
  socket.on('statusJoystick', function(joystick){
    var motor =  processDataJoystick(joystick);
      motorRigth.forward(motor.rigth);
      motorLeft.forward(motor.left);
      motorBack.forward(motor.back);
      console.log('motorBack: ' + motor.back + ' motorLeft: ' + motor.left + ' motor.rigth: ' + motor.rigth);


  });

  // activate weapon
  socket.on('activateWeapon', function(){
      motorWeapon.forward(255);
      console.log('activate weapon');
  });

  // deactivate weapon
  socket.on('deactivateWeapon', function(){
      motorWeapon.forward(0);
      console.log('deactivate weapon');
  });

  // calibrate joystick gain
  socket.on('calibrateGain', function (gain) {
    gainX = gain.X;
    gainY = gain.Y;
    console.log('gain' + gain);
  });
// stop all motors
  socket.on('stopAllMotors', function(){
    motorRigth.stop();
    motorLeft.stop();
    motorBack.stop();
    motorWeapon.stop();
    console.log('stop');
  });


});

// when board ready initiates node server
board.on("ready", function() {
  // Create the left motor
  motorLeft = new five.Motor(3);

  // Create the rigth motor left
  motorRigth = new five.Motor(5);

  // Create the back motor
  motorBack = new five.Motor(10);

  // Create the weapon motor
  motorWeapon = new five.Motor(11);



  http.listen(3000, function() {
    console.log('listening on *:3000');
  });


});


/**
 * process data from virtual joystick
 * @method processDataJoystick
 * @param  {[virtualjoystick objet]}            joystick
 * @return {[object]}                     [ motor object that controls pwm and back relay signal]
 */
function processDataJoystick(joystick){
  var motor = {};
// if down turns off front motors and turn on back
  if (joystick.down){
      motor.left = 0;
      motor.rigth = 0;
      motor.back = 255;
      return motor;
  }


// only positive values of delta matters. Tunning the joystick gain.
  joystick.deltaY = Math.abs(joystick.deltaY) * gainY;
  joystick.deltaX = joystick.deltaX * gainX;
// tunning the joystick to be maximum value of 255
  if (joystick.deltaY > maxDeltaY)
    joystick.deltaY = 255;
  if (joystick.deltaX > maxDeltaX)
      joystick.deltaX = 255;
  if (joystick.deltaX < -maxDeltaX)
      joystick.deltaX = -255;

    motor.left = joystick.deltaY - joystick.deltaX;
    motor.rigth = joystick.deltaY  + joystick.deltaX;
    motor.back = 0;

    return motor;


}
