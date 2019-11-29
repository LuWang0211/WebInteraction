// Your web app's Firebase configuration
let isLoggedIn = false;

const firebaseConfig  = {
  apiKey: "AIzaSyB5SmzklIRd401T_n2ShOAKHB5mshkcNVU",
  authDomain: "gix-lab9.firebaseapp.com",
  databaseURL: "https://gix-lab9.firebaseio.com",
  projectId: "gix-lab9",
  storageBucket: "gix-lab9.appspot.com",
  messagingSenderId: "712738147741",
  appId: "1:712738147741:web:12993d16a4b53e840d3374",
  measurementId: "G-ZK2VFT2CQX"
};

function initializeControlUI() {
  // Initialize Firebase
  // console.log("start: " + firebase.apps.length);
  firebase.initializeApp(firebaseConfig);
  firebase.auth().signInAnonymously().catch(handleLoginError);
  firebase.auth().onAuthStateChanged(handleAuthSuccess);
}

function handleLoginError(error) {
  console.log("error.code:" + error.code)
  console.log("error.message:" + error.message)
}

function handleAuthSuccess(user) {
  if (user) {
    // User is signed in.
    let isAnonymous = user.isAnonymous;
    let uid = user.uid;
    isLoggedIn = true;
    var button = document.getElementById("speakButton");
    button.disabled = false;
    console.log("Now logged in as " + uid);
  }
}

function handleButtonClick() {
  // initializeControlUI();
  console.log("isLoggedIn: " + isLoggedIn);
  if (isLoggedIn) {
    let dbRef = firebase.database().ref('/');
    let data = {};
    let textBox = document.getElementById("speakText");
    console.log("textBox: " + textBox);
    data["say"] = textBox.value; 
    dbRef.update(data);
    console.log("Sent data to database: " + data.say);
    // speak the text
    let words = "The test you inputted is that " + data.say + ". I have sent it to the database.  ";
    console.log(`words: ` + words);
    speak(words, 'en-US');
  } 
  else 
    console.log("You are not logged in.");
}

let voices = [];

if ('speechSynthesis' in window) {   
  function updateVoices() {
    voices = window.speechSynthesis.getVoices();
    console.log(`voices` + voices);
  }
  window.speechSynthesis.onvoiceschanged = updateVoices;
}
   

/*Function that makes the browser speak the text in a given language, when sending data*/
function speak(text, lang) {
  /*Check that your browser supports test to speech*/
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance();
    console.log(`msg` + msg);

    const voices = window.speechSynthesis.getVoices();
    console.log(`voices length: ` + voices.length);
    
    if (voices.length >= 0) {
      console.log("Your browser supports " + voices.length + " voices");
      console.log(voices);
      msg.voice = voices.filter(function(voice) { return voice.lang == lang; })[1];
      console.log(`msg.voice: ` + msg.voice);
    }

    msg.voiceURI = 'native';
    msg.volume = 0.8; // 0 to 1
    msg.rate = 0.6; // 0.1 to 10
    msg.pitch = 0.6; //0 to 2
    msg.text = text;
    // console.log( `msg.text: `+ msg.text);
    msg.lang = lang;
    msg.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' milliseconds.');
    };
    
    console.log(` msg: ` + msg.text);
    
    speechSynthesis.speak(msg);
  }
}