// Be sure to choose File > Import Library > p5.serialport.js from the P5 IDE main menu to load serial library

// Terminal command to get API Key: cd desktop/spotAuth/auth_code && node app.js
// then go to LocalHost:8888
// Terminal command to start server:  node ~/node_modules/p5.serialserver/startserver.js


var serial;                            // variable to hold an instance of the serialport library
var options = {baudrate: 9600};      // set baudrate to 9600; must match Arduino baudrate
var portName = '/dev/cu.usbmodem1411'; // fill in your serial port name here
var inData;                           // for incoming serial data
var slider;
var values = [];
var idList;
var nameList;
var tempoList;
var diffList;
var urlList;
var apiKey;
var diff;

var cSmall;
var cPos;

var frame;

function setup() {
  createCanvas(720, 480);          // make the canvas
  serial = new p5.SerialPort();    // make a new instance of the serialport library
  serial.on('data', serialEvent);  // callback for when new data arrives
  serial.on('error', serialError); // callback for errors
  serial.open(portName, options);  // open a serial port @ 9600

  apiKey = 'BQD--Aq3mAVIN3krlfGvAjrKYWBChOaTw7ge-EAlJvoo9M0AIaZXffTpe8Y03-XQaoSgFbNwayi0QDmATSzlL71B7YEirlpGuMnsm-1n11bMtlZJJVe9AktY_XstdPHmo70dGGLGmwVNTXmMrb7mlVi_X9qak8YoGCUvMH_OjdDDK6qV5ZV_XoNetdZKpWWrkl0vTw';
  //refresh();
  getPlaylist();

}

function draw() {
  serialEvent();


  background(255);



  text("bpm: " + values[0], 720/4, 480/2);

  text("sensor value: " + values[1], 720*.75-70, 480/2);


  push();
  fill(color(240, 15, 0));
  if (values[1] < 355) {

    ellipse(720/2, 480/2, 50);

  } else if (values[1] >= 355) {

    ellipse(720/2, 480/2, values[1]/6);

  }
  pop();
}



function getPlaylist() {

    nameList = [];
    idList = [];
    tempoList = [];
    urlList = [];
    diffList= [];

    $.ajax({
        url: "https://api.spotify.com/v1/users/spotify/playlists/4hOKQuZbraPDIfaGbM3lKI",
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);
        },
        success: function (response) {
            //console.log(response);
            //response - the JSON FILE
            //response.X will continue to the sub folders (must be in order)
            var items = response.tracks.items;
            for (i = 0; i < items.length; i++) {

            var url = items[i].track.external_urls.spotify;

            var tID = items[i].track.id;

            var tName = items[i].track.name;

            nameList.push(tName);

            idList.push(tID);

            urlList.push(url);

            //Takes all the track ID's from TOP 100 SPOTIFY PLAYLIST and adds them to trackIDS[] array
            }
          // chain next function here to make sure they execute in order
          getFeatures();
        },
        error: function (err) {
            console.log(err);
        },
    });
}

function getFeatures() {
  $.ajax({
        url: "https://api.spotify.com/v1/audio-features?ids=" + idList.join(","),
        type: "GET",
        beforeSend: function(xhr){
            xhr.setRequestHeader('Authorization', 'Bearer ' + apiKey);
        },
        success: function (response) {
            //console.log(response);
            //response - the JSON FILE
            //response.X will continue to the sub folders (must be in order)
            for (i = 0; i < response.audio_features.length; i++) {
            var tTempo = response.audio_features[i].tempo

            tempoList[i] = tTempo;
            }
        },
        error: function (err) {
            console.log(err);
        },
    });



}

function findDiff() {

  for (i = 0; i < tempoList.length; i ++){

    diff = tempoList[i] - values[0];

    if(diff < 0) {

      diff = diff * -1;

    }
      diffList.push(diff);
  }
  matchSong();
}

function playSong() {


  //frame = createElement("iframe");


  //document.getElementById('iFrame').src = urlList[0];

  window.location.href = urlList[cPos];

}



function serialEvent() {
  // inData = Number(serial.read());   // can use this when just looking for 1 byte msgs from Arduino

  // Alternatively, read a string from the serial port, looking for new line as data separator:
  var inString = serial.readStringUntil('\n');
  // check to see that there's actually a string there:
  if (inString.length > 0 ) {
    // convert it to a number:
    inData = String(inString);

    values = inData.split(",");

  }
}

function matchSong() {

  cSmall = 1000;

  cPos = null;

  for(i = 0; i < diffList.length; i++) {

    if(diffList[i] < cSmall) {

      cSmall = diffList[i];

      cPos = i;

    }



  }
  playSong();
}


function serialError(err) {
  print('Something went wrong with the serial port. ' + err);
}
