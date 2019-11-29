// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyB5SmzklIRd401T_n2ShOAKHB5mshkcNVU",
  authDomain: "gix-lab9.firebaseapp.com",
  databaseURL: "https://gix-lab9.firebaseio.com",
  projectId: "gix-lab9",
  storageBucket: "gix-lab9.appspot.com",
  messagingSenderId: "712738147741",
  appId: "1:712738147741:web:12993d16a4b53e840d3374",
  measurementId: "G-ZK2VFT2CQX"
};

// For step 2: JavaScript speechSynthesis.speak() without user activation is no longer allowed since M71
// add speak trigger
let hasUSerActivatedDeferred = $.Deferred();
let hasUSerActivatedDeferredPromise = hasUSerActivatedDeferred.promise();

window.hasUSerActivatedDeferredPromise  = hasUSerActivatedDeferredPromise;

// robotInitialize 1: draw robot, make your robot face look around, and Q&A
// robotInitialize 2: lab 9- step 2 & step3
function robotInitialize() {
  
    drawRobot();  //draw robot

    let distanceFromCenterX = 80;
    let eyeCenterY = 120;

    let shouldBlink = false;  // blink flag

    let angle = 0; // eye move angle

    // blinking
    window.setInterval(() => {
     
        drawEye(200 - distanceFromCenterX, eyeCenterY, angle, shouldBlink);
        drawEye(200 + distanceFromCenterX, eyeCenterY, angle, shouldBlink);

    }, 100);

    // blinks=ing randomized within 1s to 6s
    function triggerBlick() {
      const triggerTime = 1000 + Math.floor(Math.random() * 5000);
      const triggerTime2 = 200;

      window.setTimeout(() => {
        shouldBlink = !shouldBlink;

        triggerBlick();
      }, shouldBlink ? triggerTime2 : triggerTime );
    }

    triggerBlick();

    
    const canvas = document.getElementById('myCanvas');
    const canvasBoundingBox = canvas.getBoundingClientRect();

    const cavansCenterX = canvasBoundingBox.x + canvasBoundingBox.width / 2;
    const cavansCenterY = canvasBoundingBox.y + canvasBoundingBox.height / 2;

    // Trackmouse Position
    window.addEventListener('mousemove', (event) => {
        const xDiff = (event.pageX - cavansCenterX);
        const yDiff = (cavansCenterY - event.pageY);

        angle = Math.atan2(yDiff, xDiff);
    }); 

    // interact with Firebase
    firebase.initializeApp(firebaseConfig);
    let dbRef = firebase.database().ref('/say/');
    // console.log(`dbRef: `+  dbRef);
    dbRef.on("value", getDataFromFirebase);
    // Register a callback for when a detection is updated in the database
    var dbImg = firebase.database().ref('/detection/');
    dbImg.on("value", newFaceDetected);
   
}

// Draw Robot
function drawRobot() {
    var distanceFromCenterX = 80;
    var eyeCenterY = 120;

    drawEye(200 - distanceFromCenterX, eyeCenterY);
    drawEye(200 + distanceFromCenterX, eyeCenterY);
    drawMouth();
    drawEyebrows(120, 40);
    drawEyebrows(280, 40);
}

function drawEye(eyeCenterX, eyeCenterY, angle = 0, shouldBlink) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    let eyeWidth = 80;
    let pupilWidth = 20;

    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.arc(eyeCenterX, eyeCenterY, eyeWidth / 2 * 1.2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = shouldBlink ? 'black' : "white";

    const eyesize = eyeWidth / 2 * 0.8;

    let pupilCenterX = eyeCenterX, pupilCenterY = eyeCenterY;
    let radianAngle = angle;

    pupilCenterX = eyeCenterX + Math.cos(radianAngle) * eyesize;
    pupilCenterY = eyeCenterY - Math.sin(radianAngle) * eyesize;

    ctx.arc(pupilCenterX, pupilCenterY, pupilWidth / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
}

function drawMouth() {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.moveTo(120, 200);
    ctx.lineTo(280, 200);
    ctx.moveTo(120, 200);
    ctx.lineTo(200, 250);
    ctx.moveTo(200, 250);
    ctx.lineTo(280, 200);
    ctx.stroke();
}

function drawEyebrows(EyebrowsX, EyebrowsY) {
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    ctx.strokeStyle = "black";
    ctx.lineWidth = 6;
    ctx.moveTo(EyebrowsX - 45, EyebrowsY + 5);
    ctx.lineTo(EyebrowsX, EyebrowsY - 5);
    ctx.moveTo(EyebrowsX, EyebrowsY - 5);
    ctx.lineTo(EyebrowsX + 45, EyebrowsY + 5);
    ctx.stroke();
}

//-------------------------------------------------------------
//Step 2
/*This function handles a value change event triggered from the database*/
function getDataFromFirebase(snapshot) {
  // console.log(`snapshot: `+ snapshot.val());
  /* Get the data value into a Javascript object*/
  let dataReadings = snapshot.val();
  // console.log(`dataReadings: `+ dataReadings);
  /*Display the latest reading on the message div*/
  let messageDiv = document.getElementById("robotReply");
  messageDiv.innerHTML ="Latest Roboot reading: '" + dataReadings  + "'";
  console.log(`newestReading: `+ dataReadings);
  let words = " You have a new message: " + dataReadings;
  speak(words, 'en-US');
}

//handles speak the data got from database
let voices = [];

if ('speechSynthesis' in window) {   
  function updateVoices() {
    voices = window.speechSynthesis.getVoices();
    console.log('voices has changed to:', voices);
  }
  window.speechSynthesis.onvoiceschanged = updateVoices;
}

// <!-- JavaScript speechSynthesis.speak() without user activation is no longer allowed since M71    -->
// <!-- using this modeal as speak trigger   -->
function modalClose() {
  hasUSerActivatedDeferred.resolve();
  $.modal.close();
}

function speak(text, lang) {  
  
  hasUSerActivatedDeferredPromise.then(() => {
    speakInternal(text, lang);
  });
  
  if (hasUSerActivatedDeferred.state() != 'resolved') {    
    $('#myConfirm').modal({
      showClose: false
    });
  };
}

/*Function that makes the browser speak a text in a given language*/
function speakInternal(text, lang) {
  /*Check that your browser supports test to speech*/
  // console.log(`start speak ${text}`);
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance();
    // console.log(`msg` + msg);

    // const voices = window.speechSynthesis.getVoices();
    // console.log(`voices length: ` + voices.length);
    
    if (voices.length >= 0) {
      console.log("Your browser supports " + voices.length + " voices");
      console.log(voices);
      msg.voice = voices.filter(function(voice) { return voice.lang == lang; })[1];
      // console.log(`msg.voice: ` + msg.voice);
    }

    msg.voiceURI = 'native';
    msg.volume = 0.8; // 0 to 1
    msg.rate = 0.6; // 0.1 to 10
    msg.pitch = 0.6; //0 to 2
    msg.text = text;
    console.log( `msg.text: `+ msg.text);
    msg.lang = lang;
    msg.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' milliseconds.');
    };
    speechSynthesis.speak(msg);
  }
}

//-------------------------------------------------------------
//Step 3
//Make your web app talk to Python through Firebase
/* This function checks and sets up the camera */
function newFaceDetected(snapshot) {
  detection = snapshot.val();
}

function startVideo() {
  if (navigator.mediaDevices && 
      navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
      .then(handleUserMediaSuccess)
      .catch(handleUserMediaError);
  }
}

/* This function stops the camera */
function endVideo() {
  myVideo.pause();
  console.log("Video off successfully");
}

function handleUserMediaError(error){
  console.log(error);
}

function handleUserMediaSuccess(stream){
  var video = document.getElementById("myVideo");
  video.srcObject = stream;
  // video.play();
  console.log("success");
  window.setInterval(captureImageFromVideo, 200);
}

// The variable that holds the detected face information, which will be updated through Firebase callbacks
let detection = null;

/*this function changes the robot cheek color when detecting face*/
function drawcheek(color){
    let c = document.getElementById("myCanvas");
    let ctx = c.getContext("2d");
    let cheekWidth = 50;

    ctx.beginPath();
    ctx.fillStyle = color ? 'pink' : "#ccc";
    ctx.arc(90, 200, cheekWidth / 2 * 1, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = color ? 'pink' : "#ccc";
    ctx.arc(310, 200, cheekWidth / 2 * 1, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  
}

function captureImageFromVideo() {
  const canvas = document.getElementById("mainCanvas");
  const context = canvas.getContext("2d");
  
  const video = document.getElementById("myVideo");
  canvas.setAttribute("width", video.width);
  canvas.setAttribute("height", video.height);  
  // Draw video image onto Canvas
  context.drawImage(video, 0, 0, video.width, video.height);

  sendSnapshot();

  // If a face detection has been received from the database, draw a rectangle around it on Canvas
  if (detection) {
    const face = detection[0];
    // console.log('face', face)
    // console.log('context', face.x, face.y)
    context.beginPath();
    context.moveTo(face.x, face.y);
    context.lineTo(face.x + face.w, face.y);
    context.lineTo(face.x + face.w, face.y + face.h);
    context.lineTo(face.x, face.y + face.h);
    context.lineTo(face.x, face.y);
    context.lineWidth = 5;
    context.strokeStyle = "#0F0";
    context.fillStyle = "#0F0";
    context.stroke();
    
    let flag = document.getElementById("imgdetection");
    flag.innerHTML ="Haha, I can see you now. Wow, my cheeks turn red.";
    
    //Cheeks turn red
    drawcheek(true);

  }else{
    let flag = document.getElementById("imgdetection");
    flag.innerHTML ="Sorry, I can't see clearly, could you look at the camera again?";
    
    //Cheeks not turn red
    drawcheek(false);
  }
}
  
function sendSnapshot() {
  const canvas = document.getElementById("mainCanvas");
  // Convert the image into a a URL string with built0-in canvas function 
  const data = canvas.toDataURL();
  const commaIndex = data.indexOf(",");
  const imgString = data.substring(commaIndex+1,data.length);
  storeImage(imgString);
}

function storeImage(imgContent)
{
    var dbRef = firebase.database().ref('/');
    dbRef.update({"image":imgContent});
}



