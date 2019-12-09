/* eslint-disable  func-names */
/* eslint-disable  no-console */

const fetch = require('node-fetch');
const Alexa = require('ask-sdk');
//var https = require('https');

const api_token = "a4f253c268018e60b10cc386ad46f61752add01431186cb03305b8c05e3470f3";
const recipe_url = "https://apim.workato.com/test-v1496/calendar-sync";

/*
function httpGet(data) {
  return new Promise(((resolve, reject) => {
      var options = {
        host: 'apim.workato.com/test-v1496/calendar-sync',
        port: 443,
        path: '/test-v1496/calendar-sync',
        //headers:{
        //  'api-token': api_token,
        //  'content-type': 'application/json'
        //},
        method: 'GET',
    };
    
    console.log("options done");
    
    //const request = https.request(options, (response) => {
    const request = http.request(options, (response) => {
      response.setEncoding('utf8');
      let returnData = '';

      response.on('data', (chunk) => {
        returnData += chunk;
      });

      response.on('end', () => {
        console.log("on response end returnData");
        console.log(returnData);
        resolve(returnData);
      });

      response.on('error', (error) => {
        reject(error);
      });
    });
    request.end();
  }));
}
*/

const GetNewNamesHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
        && request.intent.name === 'GetNewNamesIntent';
  },
  /*
  async handle(handlerInput) {
    let firstPerson = handlerInput.requestEnvelope.request.intent.slots.personOne.value;
    let secondPerson = handlerInput.requestEnvelope.request.intent.slots.personTwo.value;
    
    firstPerson = firstPerson.toLowerCase();
    secondPerson = secondPerson.toLowerCase();
    
    const data = JSON.stringify({
        "person_One": employeeNames[firstPerson],
        "person_Two": employeeNames[secondPerson]
      });
    
    const response = await httpGet(data);
    
    console.log(response);

    return handlerInput.responseBuilder
            //.speak("Okay. Here is what I got back from my request. " + response.value.joke)
            .speak("Okay. Here is what I got back from my request. " + response)
            .reprompt("What would you like?")
            .getResponse();
  },
  */
  
  handle(handlerInput) {
    //const factArr = numberFacts;
    let firstPerson = handlerInput.requestEnvelope.request.intent.slots.personOne.value;
    let secondPerson = handlerInput.requestEnvelope.request.intent.slots.personTwo.value;
    //const url = `http://numbersapi.com/${theNumber}`;
    
    firstPerson = firstPerson.toLowerCase();
    secondPerson = secondPerson.toLowerCase();
    
    console.log("firstPerson");
    console.log(firstPerson);
    
    console.log("secondPerson");
    console.log(secondPerson);
    
    console.log("employeeNames[firstPerson]");
    console.log(employeeNames[firstPerson]);
    
    console.log("employeeNames[secondPerson]");
    console.log(employeeNames[secondPerson]);
    
    const randomFact = firstPerson + " and " + secondPerson;
    const speechOutput = SCHEDULE_MEETING_MSG + randomFact;
    
    const data = JSON.stringify({
        "person_One": employeeNames[firstPerson],
        "person_Two": employeeNames[secondPerson]
      });
    
    fetch(recipe_url, { 
      method: 'POST', 
      headers: { 
        'api-token': api_token,
        'content-type': 'application/json' 
      },
      body: data
    }).then(function(res) {
      console.log(res);
      let response = res.json();
      console.log(response);
      console.log("res data");
      console.log(response.reply);
    });
    
    //const repromptOutput = "Would you like another fact?";
    
    return handlerInput.responseBuilder
      .speak(speechOutput)
      .reprompt(HELP_REPROMPT)
      .withSimpleCard(SKILL_NAME, randomFact)
      .getResponse();
  },
};

const HelpHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(HELP_MESSAGE)
      .reprompt(HELP_REPROMPT)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest'
      && (request.intent.name === 'AMAZON.CancelIntent'
        || request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder
      .speak(STOP_MESSAGE)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, an error occurred.')
      .reprompt('Sorry, an error occurred.')
      .getResponse();
  },
};

const SKILL_NAME = 'calendar meeting';
const SCHEDULE_MEETING_MSG = 'Scheduling earliest meeting between: ';
const HELP_MESSAGE = 'You can tell me to schedule a meeting between two people, or, you can say exit... What can I help you with?';
const HELP_REPROMPT = 'What can I help you with?';
const STOP_MESSAGE = 'Goodbye!';

const employeeNames = {
  "rishi mallik": "rishi.mallik@workato.com",
  "inwoo song": "inwoo.song@workato.com",
  "ran fang": "ran.fang@workato.com",
  "zander liow": "zander.liow@workato.com",
  "frankie ye": "frankie.ye@workato.com"
};

const skillBuilder = Alexa.SkillBuilders.standard();

exports.handler = skillBuilder
  .addRequestHandlers(
    GetNewNamesHandler,
    HelpHandler,
    ExitHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();