# Creating A Modern Chat Application – Revised For 6.2 Features

## Introduction

One of the many use-cases for Diffusion© is creating a scalable chat feature for customer engagement and collaborative work in both web and mobile. This guide will be the first of four parts for writing a modern chat application which will use some great Diffuion features like Time series topics and Properties of topics that we are going to explore together.

## Getting Started

### Plattform

#### Node.js

The JavaScript runtime on which to run Angular and aquire the Diffusion package.

#### Angular 5

We will use Angular 5 as our front-end of choice, due to Angular 6 missing something ~~Elaborate more over what exactly~~. A good start into Angular is given here from its developers at [https://angular.io/tutorial](https://angular.io/tutorial).
We won't explore Angular, and just stick to the instructions given without going into detail.

#### Diffusion 6.2

A running installation of Diffusion is required. Everything we need to get started can be found on the product website at [https://www.pushtechnology.com](https://www.pushtechnology.com), including the FREE download with the evaluation licence of 5 seats, 1000 Topics and ~~something not coming to mind right now~~.

### Setup

Install Node.js and npm if you haven't already. It is also a good idea to get the Diffusion Server installed and running at this point.

Then run npm with these parameters to install Angular globally on your system. Take note of the '1' at the end, this is needed to install Angular 5 instead of 6.

`npm install -g @angular/cli@1`

First `cd` into a directory in which you wish to create the project. Then run.

`ng new demo-chat-app`

Since we are already using npm, might as well install the diffusion client into our project with it.

`npm install diffusion`

## Basic Chat

We will now create a component in Angular that will host our basic chat.
Cd into the sub-folder `./src/app` and enter:

 `ng generate component basic-chat`

After that, open the file `./basic-chat/basic-chat.component.ts` and change the existing imports to these.

``` TypeScript
import { Component, OnInit } from '@angular/core'; // OnInit to execute code on initialization.
import * as diffusion from 'diffusion'; // The Diffusion library.
import { TopicSpecification } from 'diffusion'; // Required for Time series topics.
```

Add `implements OnInit` to the `BasicChatComponent` class with these fields.

``` TypeScript
export class BasicChatComponent implements OnInit {
    chatSession: diffusion.Session;
    chatlog = new Array<ChatMessage>();
    // A topic specification needed for Timeseries, so we can add the Event Value Type property.
    chatSpecification: TopicSpecification = {
        type: diffusion.topics.TopicType.TIME_SERIES,
        properties: {
            TIME_SERIES_EVENT_VALUE_TYPE: 'json'
        }
    };

    // -- More --
}
```

We are using the Time Series feature so we can send some of the past messages even to clients that just joined the topic after these have been sent. Time series topics can be adjusted with Topic properties.
More can be read at our documentation for [Time series topics](https://docs.pushtechnology.com/docs/6.1.2/manual/html/designguide/data/topics/timeseries_topics.html) and [Properties of topics](https://docs.pushtechnology.com/docs/6.1.2/manual/html/designguide/data/topics/topic_properties.html).

your IDE/editor might now inform you that the type `ChatMessage` doesn't exist yet, so let us create one real quick, outside of `BasicChatComponent`. We will need some kind of identifier to know who sent the message, the message content comprised of the text of our message and then a timestamp that might come in handy.

``` TypeScript
class ChatMessage {
    constructor(public id: string, public timestamp: number, public content: string) { }
}
```

Back to `BasicChatComponent`, our first function will be the `ngOnInit()` for which we needed the implement. It also contains the code to connect to the diffusion server. Replace host, port, etc. accordingly.

``` TypeScript
ngOnInit() {
    // Instruction to connect to a diffusion server which returns a 'thanble' after it connected.
    const connectionPromise = diffusion.connect({
        host: myHost,
        port: myPort,
        principal: myPrincipal,
        credentials: myPassword
    });

    // -- More --
}
```

If you are running the server localy with no modifications to security, the information would be 'localhost', 8080, 'control' and 'password'.

Next we use the `Promise` to retrieve the session and add a topic which we will use as our chat channel. Here we use that topic specification we declared earlier.

``` TypeScript
connectionPromise.then((session) => {
    this.chatSession = session;
    const topicPromise = session.topics.add(
        'Demos/Chat/Channel',
        this.chatSpecification
    );

      // -- More --
});
```

When the topic has been added succesfully we want to listen to its stream, so we can see every change done to it.

``` TypeScript
topicPromise.then(() => {
    // Subscribing from here.
    session.addStream('Demos/Chat/Channel', diffusion.datatypes.json()).on(
        'value', (topic, specification, newValue, oldValue) => {

              // -- More --
        });
    session.select('Demos/Chat/Channel');
});
```

If such a change happened, we handle it by filling the listener function we declared earlier. Here we expect to receive chat messsages, which we will put into our Array of `ChatMessage`.

``` TypeScript
// create a new instance of ChatMessage.
const msg = new ChatMessage(
    newValue.value.get().generatedId,
    newValue.timestamp,
    newValue.value.get().content
);
this.chatlog.push(msg);
```

This will push a new `ChatMessage` item with the information we got from `newValue` into our chatLog, and Angular will manage updating the front-end accordingly.

We have the code to receive messages, but none to send any, so let's get to that. Create a method inside `BasicChatComponent` which takes a string parameter.

``` TypeScript
sendMessage(message: string) {
    const msg = { content: message, generatedId: this.chatSession.sessionID };

    // Will create a promise that appends the passed value as payload for the topic.
    this.chatSession.timeseries.append(
        'Demos/Chat/Channel',
        msg
    ).then(() => { });
}
```

You might raise an eye brow about `sessionID` that we get from our session. We are using this id to differentiate between clients in the channel. It is a bit unsightly but fret not, user names will be part of the whole tour soon enough.

Speaking recently of front-end, we finished with the TypeScript part and now we need to have this displayed somehow. Go to the template `./basic-chat/basic-chat.component.html` and replace the placeholder with the following HTML.

``` HTML
<ul>
  <li *ngFor="let chatItem of chatlog">{{chatItem.author}}: {{chatItem.content}}</li>
</ul>
<input #textInput (keyup.enter)="sendMessage( textInput.value ); textInput.value=''" type="text">
```

This will use the chat message array `chatlog` and list for each chat message entry that it contains a coresponding list item in the HTML output. Below that is a simple input box with a keyup event, which sends the value it contains to the `sendMessage` function as a parameter and then clears the value field again.

### End Part 1

That is all for part 1. This chat is very basic in both functionality and design, but it makes for a great starting point. Ideas for some minor improvements are listed right below, And for an even deeper dive, there will be part 2 released soon, in which we explore creating a simple control client that will have all control operations delegated to it like manage topic creation or basic administration.

The entire code that we have written can be found at the very bottom.

---

## Optional Improvements

### Add the property 'REMOVAL' to the topic for when there are no more subscribers

Insert the following item in the properties object of `chatSpecification`.

`REMOVAL: 'when subscriptions < 1 for 5m'`

which should look like this.

``` TypeScript
chatSpecification: TopicSpecification = {
    type: diffusion.topics.TopicType.TIME_SERIES,
    properties: {
        TIME_SERIES_EVENT_VALUE_TYPE: 'json',
        REMOVAL: 'when subscriptions < 1 for 5m'
  }
};
```

This will remove the topic when there are no subscripbers for 5 minutes, keeping the server clean and perfomant.

An indepth dive into removing topics automatically can be found here: [Removing topics automatically](https://docs.pushtechnology.com/docs/6.1.2/manual/html/developerguide/client/topics/topiccontrol/remove_with_policy.html).

### Error handling

As explained in [Best practice for developing clients](https://docs.pushtechnology.com/docs/6.1.3/manual/html/developerguide/client/developing_bestpractice.html) Diffusion runs on an asynchronous programming model. In case the answers of those asynchronous calls aren't what is required, if there are any answers at all, it is necessary to handle accordingly and ensure the user experience isn't suffering too much from that. A good start to handle errors when using diffusion is by adding a function as the second parameter in the `promise`.

``` TypeScript
  sendMessage(message: string) {
    const msg = { content: message, generatedId: this.chatSession.sessionID };
    this.chatSession.timeseries.append(
      'Demos/Chat/Channel',
      msg
    ).then(() => { }, (error) => console.error(error));
  }
```

This is a simple but convinient console output that can be viewed using the browser's development functions. we could have added a message inside the chat log that says that the chat isn't working at this time.

---

## Source Code "basic-chat.components.ts"

``` TypeScript
/**
 * Copyright © 2018 Push Technology Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { Component, OnInit } from '@angular/core'; // OnInit to execute code on initialization.
import * as diffusion from 'diffusion'; // The Diffusion library.
import { TopicSpecification } from 'diffusion'; // Required for Timeseries Topics

@Component({
  selector: 'app-basic-chat',
  templateUrl: './basic-chat.component.html',
  styleUrls: ['./basic-chat.component.css']
})

export class BasicChatComponent implements OnInit {
  chatSession: diffusion.Session;
  chatlog = new Array<ChatMessage>();

  // A topic specification needed for Timeseries, so we can add the Event Value Type property.
  chatSpecification: TopicSpecification = {
    type: diffusion.topics.TopicType.TIME_SERIES,
    properties: {
      // REMOVAL: 'when subscriptions < 1',
      TIME_SERIES_EVENT_VALUE_TYPE: 'json',
      // TIME_SERIES_SUBSCRIPTION_RANGE: '5'
    }
  };

  ngOnInit() {
    const connectionPromise = diffusion.connect({
      host: window.location.host,
      port: 8080,
      principal: 'control',
      credentials: 'password'
    });

    connectionPromise.then((session) => {
      this.chatSession = session;

      const topicPromise = session.topics.add(
        'Demos/Chat/Channel',
        this.chatSpecification
      );

      topicPromise.then(() => {
        // subscribing from here.
        session.addStream('Demos/Chat/Channel', diffusion.datatypes.json()).on(
          'value', (topic, specification, newValue, oldValue) => {

            // create a new instance of ChatMessage.
            const msg = new ChatMessage(
              newValue.value.get().generatedId,
              newValue.timestamp,
              newValue.value.get().content);
            this.chatlog.push(msg);
          });
        session.select('Demos/Chat/Channel');
      });
    }, (error) => console.log(error));
  }

  sendMessage(message: string) {
    const msg = { content: message, generatedId: this.chatSession.sessionID };
    this.chatSession.timeseries.append(
      'Demos/Chat/Channel',
      msg
    ).then(() => { }, (error) => console.error(error));
  }
}

class ChatMessage {
  constructor(public author: string, public timestamp: number, public content: string) { }
}
```

## Source Code "basic-chat.components.html"

``` HTML
<!--
/**
 * Copyright © 2018 Push Technology Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
-->

<ul>
  <li *ngFor="let chatItem of chatlog">{{chatItem.author}}: {{chatItem.content}}</li>
</ul>
<input #textInput (keyup.enter)="sendMessage( textInput.value ); textInput.value=''" type="text">
```