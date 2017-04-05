import { Injectable } from '@angular/core';
import { HttpClient } from './../util/http.service'

import 'rxjs/add/operator/toPromise';

import { Person } from './person';

@Injectable()
export class PersonsService {
  private url = 'https://easyanticafedevelop.herokuapp.com/api/person';

  constructor(private http: HttpClient) {
  }

  getPersons() {
    return this.http.get(this.url + '/')
    .toPromise()
    .then(response => response.json().results as Person[])
    .catch(this.handleError);
  }

  create(person: Person): Promise<Person> {
    return this.http
      .post(this.url + '/', person)
      .toPromise()
      .then(res => res.json())
      .catch(this.handleError);
  }

  update(person: Person): Promise<Person> {
    const url = `${this.url}/${person.id}/`;
    return this.http
      .put(url, person)
      .toPromise()
      .then(() => person)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.url}/${id}/`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  get(id: number): Promise<Person> {
    const url = `${this.url}/${id}/`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Person)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

