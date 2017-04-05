import 'hammerjs';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { MomentModule } from 'angular2-moment';

import { AppComponent } from './app.component';
import { SessionsListComponent } from './sessions/sessions.component';
import { NewCardDialog } from './sessions/sessions.component'
import { SessionDialog } from './sessions/sessions.component'
import { PersonDialog } from './sessions/sessions.component'

@NgModule({
  declarations: [
    AppComponent,
    SessionsListComponent,
    NewCardDialog,
    SessionDialog,
    PersonDialog
  ],
  entryComponents: [
    AppComponent,
    SessionsListComponent,
    NewCardDialog,
    SessionDialog,
    PersonDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    MaterialModule,
    MomentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
