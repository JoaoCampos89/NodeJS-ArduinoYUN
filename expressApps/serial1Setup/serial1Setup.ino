
 /*The circuit:
  Arduino Yún

 created March 2013
 by Massimo Banzi
 modified by Cristian Maglie

 This example code is in the public domain.

 http://www.arduino.cc/en/Tutorial/YunSerialTerminal

 */

char serial;
long linuxBaud = 57600;

void setup() {
  Serial.begin(115200); 
  Serial1.begin(linuxBaud);  // open serial connection to Linux

  
}

void loop() {
  // put your main code here, to run repeatedly:

if (Serial1.available())
{
  Serial.print("received");
  serial=Serial1.read();
  Serial.print(serial);
  delay(500);
  Serial1.write("teste\n");
  
  
  
}

  
 delay(500);
  

}
