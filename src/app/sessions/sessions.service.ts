import { Injectable } from '@angular/core';
import { HttpClient } from './../util/http.service'

import 'rxjs/add/operator/toPromise';

import { Session } from './session';
import { $WebSocket, WebSocketSendMode } from 'angular2-websocket/angular2-websocket';

@Injectable()
export class SessionService {
  private sessionUrl = 'https://easyanticafedevelop.herokuapp.com/api/session/';
  private commandUrl = 'https://easyanticafedevelop.herokuapp.com/api/command';

  constructor(private http: HttpClient) {
  }

  getSessions() {
    return this.http.get(this.sessionUrl + '?is_active=true')
    .toPromise()
    .then(response => response.json().results as Session[])
    .catch(this.handleError);
  }

  create(name: string): Promise<Session> {
    return this.http
      .post(this.sessionUrl, JSON.stringify({name: name}))
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(session: Session): Promise<Session> {
    const url = `${this.sessionUrl}/${session.id}`;
    return this.http
      .put(url, JSON.stringify(session))
      .toPromise()
      .then(() => session)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.sessionUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  get(id: number): Promise<Session> {
    const url = `${this.sessionUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Session)
      .catch(this.handleError);
  }

  startSession(id: number): Promise<Session> {
    const url = `${this.commandUrl}/start/`;
    return this.http
      .post(url, {indentifier: id})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  stopSession(id: string): Promise<Session> {
    const url = `${this.commandUrl}/stop/`;
    return this.http
      .post(url, {indentifier: id})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

