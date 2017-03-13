import { Injectable } from '@angular/core';
import { HttpClient } from './../util/http.service'

import 'rxjs/add/operator/toPromise';

import { Card } from './card';

@Injectable()
export class CardsService {
  private cardsUrl = 'https://easyanticafedevelop.herokuapp.com/api/card/';

  constructor(private http: HttpClient) {
  }

  getCards() {
    return this.http.get(this.cardsUrl)
    .toPromise()
    .then(response => response.json().results as Card[])
    .catch(this.handleError);
  }

  create(card: Card): Promise<Card> {
    return this.http
      .post(this.cardsUrl, card)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(card: Card): Promise<Card> {
    const url = `${this.cardsUrl}/${card.id}`;
    return this.http
      .put(url, card)
      .toPromise()
      .then(() => card)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.cardsUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  get(id: number): Promise<Card> {
    const url = `${this.cardsUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Card)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

