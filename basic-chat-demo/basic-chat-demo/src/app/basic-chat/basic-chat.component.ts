import { Component, OnInit } from '@angular/core';
import * as diffusion from 'diffusion';
import { TopicSpecification, DataTypes } from 'diffusion';



@Component({
  selector: 'app-basic-chat',
  templateUrl: './basic-chat.component.html',
  styleUrls: ['./basic-chat.component.css']
})

export class BasicChatComponent implements OnInit {
  constructor() { }
  chatSession: diffusion.Session;
  chatlog = new Array();
  ngOnInit() {
    diffusion.connect({ host: window.location.host, port: 8080, principal: 'control', credentials: 'password' }).then((session) => {
      this.chatSession = session;

      const chatSpecification: TopicSpecification = {
        type: diffusion.topics.TopicType.TIME_SERIES,
        properties: {
          TIME_SERIES_EVENT_VALUE_TYPE: 'json',
        }
      };

      return session.topics.add(
        'chat/channel',
        chatSpecification
      ).then((res) => {
        console.log(res);
        // subscribing from here.
        session.addStream('chat/channel', diffusion.datatypes.json()).on(
          'value', (topic, specification, newValue, oldValue) => {
            this.chatlog.push('user: ' + newValue.value.get().content);
          });
        session.select('chat/channel');
      }, (err) => console.log(err));
    });
  }

  writeMessage(message: string) {
    const msg = { content: message };
    // const msg = 42;
    this.chatSession.timeseries.append(
      'chat/channel',
      msg
    ).then((res) => { console.log(res); }, (err) => console.log(err));
  }
}
