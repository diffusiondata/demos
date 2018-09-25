import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BasicChatComponent } from './basic-chat/basic-chat.component';
import * as Diffusion from 'diffusion';

@NgModule({
  declarations: [
    AppComponent,
    BasicChatComponent
  ],
  imports: [
    BrowserModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
