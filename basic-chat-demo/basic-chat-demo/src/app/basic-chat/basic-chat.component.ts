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
  constructor(public id: string, public timestamp: number, public content: string) { }
}
