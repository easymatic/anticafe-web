import { Injectable } from '@angular/core';
import { HttpClient } from './../util/http.service'

import 'rxjs/add/operator/toPromise';

import { Plan } from './plan';

@Injectable()
export class PlansService {
  private plansUrl = 'https://easyanticafedevelop.herokuapp.com/api/plan/';

  constructor(private http: HttpClient) {
  }

  getPlans() {
    return this.http.get(this.plansUrl)
    .toPromise()
    .then(response => response.json().results as Plan[])
    .catch(this.handleError);
  }

  create(id: number): Promise<Plan> {
    return this.http
      .post(this.plansUrl, {indentifier: id})
      .toPromise()
      .then(res => res.json().data)
      .catch(this.handleError);
  }

  update(plan: Plan): Promise<Plan> {
    const url = `${this.plansUrl}/${plan.id}`;
    return this.http
      .put(url, JSON.stringify(plan))
      .toPromise()
      .then(() => plan)
      .catch(this.handleError);
  }

  delete(id: number): Promise<void> {
    const url = `${this.plansUrl}/${id}`;
    return this.http.delete(url)
      .toPromise()
      .then(() => null)
      .catch(this.handleError);
  }

  get(id: number): Promise<Plan> {
    const url = `${this.plansUrl}/${id}`;
    return this.http.get(url)
      .toPromise()
      .then(response => response.json().data as Plan)
      .catch(this.handleError);
  }

  private handleError(error: any): Promise<any> {
    console.error('An error occurred', error); // for demo purposes only
    return Promise.reject(error.message || error);
  }
}

