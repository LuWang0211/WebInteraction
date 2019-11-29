/* TODO: Decide on a target language*/
const targetLang = 'fr';

/*Function that handles click on the second button.*/
/* TODO: Implement this function so it takes the text from the text box and uses the Google Translation API to translate it. Set up the callback for the translation request so that when the response is received, the browser speaks the translated text.*/
function translateAndSpeak() {
  const baseUrl = "https://translation.googleapis.com/language/translate/v2"
  /*TODO: If you have set up a Google account, change this to your own API key*/
  const APIKey = "AIzaSyDGuxJZBznpvtd3An58kDqmOvg6hWbknlU";
  
  /*TODO: Create the request here and use the helper function "ajaxRequest" (see below) to send the web service request using the "POST" method. Set the handlerFunction parameter to handleTranslationResponse and implement that function below*/
  

  /*TODO: remove the following line*/
  console.log("Handler for this button not implemented yet.");

}

// function translateAndSpeak() {
//   const baseUrl = "https://translation.googleapis.com/language/translate/v2"
//   /*TODO: If you have set up a Google account, change this to your own API key*/
//   const APIKey = "AIzaSyDGuxJZBznpvtd3An58kDqmOvg6hWbknlU";
  
//   var request = {
//     requests: [
//       {
//         "data": {
//           "translations": [
//             {
//               "translatedText": "Hallo Welt",
//               "detectedSourceLanguage": "en"
//             },
//             {
//               "translatedText": "Mein Name ist Jeff",
//               "detectedSourceLanguage": "en"
//             }
//           ]
//         }
//       }
//     ]
//   };

//   /*TODO: Create the request here and use the helper function "ajaxRequest" (see below) to send the web service request using the "POST" method. Set the handlerFunction parameter to handleTranslationResponse and implement that function below*/
//   $.post({
//     url: 'https://translation.googleapis.com/language/translate/v2/key=AIzaSyDGuxJZBznpvtd3An58kDqmOvg6hWbknlU',
//     data: JSON.stringify(request),
//     dataType: 'json',
//     contentType: 'application/json'
//     })
//     .then((result) => {
//         console.log(result);
//     });
  
// }

/*Function that handles the response from the web service request*/
/*TODO: Implement the following function to handle the response from the Google Translation API web sevice. See documentation for the format of the response. Your function should make the browser speak the response in the target language. You can use the speak function that is already implemented.*/
function handleTranslationResponse() {
  if (successfulRequest(this)) {
    /*This is where you got the response with the "OK" status so you can go ahead and parse this.responseText*/

    /*TODO: remove the following line*/
    console.log("Handler for the web service request is not implemented yet.");
  }
  else {
    console.log("Ready state: " + this.readyState);
    console.log("Status: " + this.status);
    console.log("Status text: " + this.statusText);
  }
}

/*Function that handles click on the first button*/
function speakOriginal() {
  const textInput = document.getElementById("textInput");
  const text = textInput.value;
  speak(text, 'en-US');
}

/*Function that makes the browser speak a text in a given language*/
function speak(text, lang) {
  /*Check that your browser supports test to speech*/
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance();
    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      console.log("Your browser supports " + voices.length + " voices");
      console.log(voices);
      msg.voice = voices.filter(function(voice) { return voice.lang == lang; })[1];
    }
    msg.voiceURI = 'native';
    msg.volume = 0.8; // 0 to 1
    msg.rate = 0.6; // 0.1 to 10
    msg.pitch = 0.6; //0 to 2
    msg.text = text;
    msg.lang = lang;
    msg.onend = function(e) {
      console.log('Finished in ' + e.elapsedTime + ' milliseconds.');
    };
    speechSynthesis.speak(msg);
  }
}

/*Helper function: sends an XMLHTTP request*/
function ajaxRequest(method, url, handlerFunction, content) {
  const xhttp = new XMLHttpRequest();
  xhttp.open(method, url);
  xhttp.onreadystatechange = handlerFunction;
  if (method == "POST") {
    xhttp.send(content);
  }
  else {
    xhttp.send();
  }
}

/*Helper function: checks if the response to the request is ready to process*/
function successfulRequest(request) {
  return request.readyState === 4 && request.status == 200;
}

function onApiResultReceived(jsonResult) {
    const $ul = $('#apiResult');

    for (let article of jsonResult.articles) {
        $ul.append($('<li/>').html(article.title));
    }
}


// function myFunc () {

//     const xhttp = new XMLHttpRequest();
//     xhttp.open('GET', 'https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=');
//     xhttp.onreadystatechange = (event) => {
//         const xhr = event.currentTarget;
        
//         if (xhr.readyState == 4 && xhr.status == 200) {
//             // console.log(typeof xhr.responseText);
//             // console.log(xhr.responseText);
//             onApiResultReceived(JSON.parse(xhr.responseText));            
//             // console.log(JSON.parse(xhr.responseText));
//         }
//     };
//     xhttp.send();
// }


function myFunc() {
    // $.ajax('https://newsapi.org/v1/articles?source=the-next-web&sortBy=latest&apiKey=')
    // .then((result) => {
    //     onApiResultReceived(result);
    // });

    var request = {
        requests: [
          {
            image: {
              source: {
                imageUri: 'https://image.flaticon.com/sprites/share/packs/174834-social-media-logos.png'
              }
            },
            features: [
              {
                type: "LOGO_DETECTION",
                maxResults: 10
              }
            ]
          }
        ]
      };
      
    $.post({
        url: 'https://vision.googleapis.com/v1/images:annotate?key=AIzaSyBttL3_rUfMaP8vZQazT8bCd5XhHkmR4lA',
        data: JSON.stringify(request),
        dataType: 'json',
        contentType: 'application/json'
    })
    .then((result) => {
        console.log(result);
    });
}
