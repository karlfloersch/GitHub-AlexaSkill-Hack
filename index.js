var repos = [ { stars: '240',
    description: 'Assistive Context-Aware Toolkit',
    author: '01org',
    repository: 'acat' },
  { stars: '224',
    description: 'Open Internet for everyone. Lantern is a free desktop application that delivers fast, reliable and secure access to the open Internet.',
    author: 'getlantern',
    repository: 'lantern' },
  { stars: '221',
    description: 'The most popular HTML, CSS, and JavaScript framework for developing responsive, mobile first projects on the web.',
    author: 'twbs',
    repository: 'bootstrap' },
  { stars: '195',
    description: 'The http://FreeCodeCamp.com open-source codebase and curriculum. Practice coding by helping nonprofits.',
    author: 'FreeCodeCamp',
    repository: 'FreeCodeCamp' },
  { stars: '159',
    description: 'A huge list of frontend development resources I collected over time. Sorted from general knowledge at the top to concrete problems at the bottom.',
    author: 'dypsilon',
    repository: 'frontend-dev-bookmarks' },
  { stars: '114',
    description: 'Transforming styles with JS plugins',
    author: 'postcss',
    repository: 'postcss' },
  { stars: '94',
    description: 'The definitive list of lists (of lists) curated on GitHub',
    author: 'jnv',
    repository: 'lists' },
  { stars: '79',
    description: 'Material Design Lite Components in HTML/CSS/JS',
    author: 'google',
    repository: 'material-design-lite' },
  { stars: '72',
    description: 'A curated list of awesome lists',
    author: 'sindresorhus',
    repository: 'awesome' },
  { stars: '68',
    description: 'Build cross platform desktop apps with web technologies',
    author: 'atom',
    repository: 'electron' } ];


/**
 * This sample demonstrates a simple skill built with the Amazon Alexa Skills Kit.
 * For additional samples, visit the Alexa Skills Kit developer documentation at
 * https://developer.amazon.com/appsandservices/solutions/alexa/alexa-skills-kit/getting-started-guide
 */

// Route the incoming request based on type (LaunchRequest, IntentRequest,
// etc.) The JSON body of the request is provided in the event parameter.
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        /**
         * Uncomment this if statement and populate with your skill's application ID to
         * prevent someone else from configuring a skill that sends requests to this function.
         */
        /*
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.[unique-value-here]") {
             context.fail("Invalid Application ID");
         }
        */

        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                        context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        }  else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                     event.session,
                     function callback(sessionAttributes, speechletResponse) {
                         context.succeed(buildResponse(sessionAttributes, speechletResponse));
                     });
        } else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId
                + ", sessionId=" + session.sessionId);
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId
                + ", sessionId=" + session.sessionId);

    // Dispatch to your skill's launch.
    getWelcomeResponse(callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    console.log("onIntent requestId=" + intentRequest.requestId
                + ", sessionId=" + session.sessionId);

    var intent = intentRequest.intent,
        intentName = intentRequest.intent.name;

    // Dispatch to your skill's intent handlers
    if ("MyColorIsIntent" === intentName) {
        setColorInSession(intent, session, callback);
    } else if ("WhatsMy" === intentName) {
        withStars(intent, session, callback);
    } else if ("WhatsMyDesc" === intentName) {
        withDesc(intent, session, callback);
    } else if ("WhatsMyColorIntent" === intentName) {
        getColorFromSession(intent, session, callback);
    } else if ("HelpIntent" === intentName) {
        getWelcomeResponse(callback);
    } else {
        throw "Invalid intent";
    }
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId
                + ", sessionId=" + session.sessionId);
    // Add cleanup logic here
}

// --------------- Functions that control the skill's behavior -----------------------

function getWelcomeResponse(callback) {
    // If we wanted to initialize the session to have some attributes we could add those here.
    var sessionAttributes = {};
    var cardTitle = "Welcome";
    var speechOutput = "Welcome to the super awesome top GitHub repo reader, "
                + "To hear a list of top repositories say, "
                + "what is new on GitHub";
    // If the user either does not reply to the welcome message or says something that is not
    // understood, they will be prompted again with this text.
    var repromptText = "Please tell me your favorite color by saying, "
                + "my favorite color is red";
    var shouldEndSession = false;

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Sets the color in the session and prepares the speech to reply to the user.
 */
function setColorInSession(intent, session, callback) {
    var cardTitle = intent.name;
    var favoriteColorSlot = intent.slots.Color;
    var repromptText = "";
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if (favoriteColorSlot) {
        favoriteColor = favoriteColorSlot.value;
        sessionAttributes = createFavoriteColorAttributes(favoriteColor);
        speechOutput = "I now know your favorite color is " + favoriteColor + ". You can ask me "
                + "your favorite color by saying, what's my favorite color?";
        repromptText = "You can ask me your favorite color by saying, what's my favorite color?";
    } else {
        speechOutput = "I'm not sure what your favorite color is, please try again";
        repromptText = "I'm not sure what your favorite color is, you can tell me your "
                + "favorite color by saying, my favorite color is red";
    }

    callback(sessionAttributes,
             buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

function createFavoriteColorAttributes(favoriteColor) {
    return {
        favoriteColor: favoriteColor
    };
}
function withDesc(intent, session, callback) {
    var cardTitle = intent.name;
    var favoriteColor;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if(session.attributes) {
        // favoriteColor = session.attributes.favoriteColor;
    }
    speechOutput = "Here are the hot repositories on GitHub with stars. ";
    var arrayLength = repos.length;
    for (var i = 0; i < arrayLength; i++) {
        
        speechOutput += repos[i].repository + ". " + repos[i].description + ". Next repository, ";
        //Do something
    }
    speechOutput +=" That's it.  Enabling self destruct. Goodbye";

    // if(favoriteColor) {
    //     speechOutput = "Your favorite color is " + favoriteColor + ", goodbye";
    //     shouldEndSession = true;
    // }
    // else {
    //     speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color "
    //             + " is red";
    // }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}
function withStars(intent, session, callback) {
    var cardTitle = intent.name;
    var favoriteColor;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if(session.attributes) {
        // favoriteColor = session.attributes.favoriteColor;
    }
    speechOutput = "Here are the hot repositories on GitHub with stars. ";
    var arrayLength = repos.length;
    for (var i = 0; i < arrayLength; i++) {
        
        speechOutput += repos[i].repository + " by " + repos[i].author + ", with " + repos[i].stars + " stars. ";
        //Do something
    }
    speechOutput +=" That's it.  Enabling self destruct. Goodbye";

    // if(favoriteColor) {
    //     speechOutput = "Your favorite color is " + favoriteColor + ", goodbye";
    //     shouldEndSession = true;
    // }
    // else {
    //     speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color "
    //             + " is red";
    // }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

function getColorFromSession(intent, session, callback) {
    var cardTitle = intent.name;
    var favoriteColor;
    var repromptText = null;
    var sessionAttributes = {};
    var shouldEndSession = false;
    var speechOutput = "";

    if(session.attributes) {
        // favoriteColor = session.attributes.favoriteColor;
    }
    speechOutput = "Here are the hot repositories on GitHub. ";
    var arrayLength = repos.length;
    for (var i = 0; i < arrayLength; i++) {
        
        speechOutput += repos[i].repository + " by " + repos[i].author + ". ";
        //Do something
    }
    speechOutput +=" That's it.  Enabling self destruct. Goodbye";

    // if(favoriteColor) {
    //     speechOutput = "Your favorite color is " + favoriteColor + ", goodbye";
    //     shouldEndSession = true;
    // }
    // else {
    //     speechOutput = "I'm not sure what your favorite color is, you can say, my favorite color "
    //             + " is red";
    // }

    // Setting repromptText to null signifies that we do not want to reprompt the user.
    // If the user does not respond or says something that is not understood, the session
    // will end.
    callback(sessionAttributes,
             buildSpeechletResponse(intent.name, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: "SessionSpeechlet - " + title,
            content: "SessionSpeechlet - " + output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    }
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    }
}
