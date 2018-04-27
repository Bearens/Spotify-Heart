#include <ArduinoTapTempo.h>
//successfully added temperature sensor
//successfully pushed both values through serial seperated by a comma

// define the pin you want to attach your tap button to
const int BPM_PIN = 5;

// make an ArduinoTapTempo object
ArduinoTapTempo tapTempo;

int PulseSensorPurplePin = 0;        // Pulse Sensor PURPLE WIRE connected to ANALOG PIN 0
int pOut = 10;

int Signal;                // holds the incoming raw data. Signal value can range from 0-1024
int Threshold = 515;            // Determine which Signal to "count as a beat", and which to ingore.

void setup() {
  // begin serial so we can see the state of the tempo object through the serial monitor
  Serial.begin(9600);
  pinMode(pOut,OUTPUT);
  // setup your button as required by your project
  pinMode(BPM_PIN, INPUT);
  digitalWrite(BPM_PIN, HIGH);
}

void loop() {
  // get the state of the button
  boolean buttonDown = digitalRead(BPM_PIN) == LOW;

  // update ArduinoTapTempo
  tapTempo.update(buttonDown);
  
  Serial.print(tapTempo.getBPM());
  Serial.print(",");

  // uncomment the block below to demo many of ArduinoTapTempo's methods
  // note that Serial.print() is not a fast operation, and using it decreases the accuracy of the the tap timing

  Signal = analogRead(PulseSensorPurplePin);  // Read the PulseSensor's value. 
                                              // Assign this value to the "Signal" variable.

  Serial.println(Signal);                    // Send the Signal value to Serial Plotter.

   
   if(Signal > Threshold){                          // If the signal is above "550", then "turn-on" Arduino's on-Board LED.  
     digitalWrite(pOut,HIGH);          
   } else {
     digitalWrite(pOut,LOW);                //  Else, the sigal must be below "550", so "turn-off" this LED.
   }


delay(25);



  
  /*
  Serial.print("len:");
  Serial.print(tapTempo.getBeatLength());
  Serial.print(",\tbpm: ");
  Serial.print(tapTempo.getBPM());
  Serial.print(",\tchain active: ");
  Serial.print(tapTempo.isChainActive() ? "yes" : "no ");
  Serial.print(",\tlasttap: ");
  Serial.print(tapTempo.getLastTapTime());
  Serial.print(",\tprogress: ");
  Serial.print(tapTempo.beatProgress());
  Serial.print(",\tbeat: ");
  Serial.println(tapTempo.onBeat() ? "beat" : "    ");
  */
}


