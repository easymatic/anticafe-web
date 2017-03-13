import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { SessionService } from './sessions.service';
import { CardsService } from './../cards/cards.service';
import { PlansService } from './../plans/plans.service';
import { HttpClient } from './../util/http.service';

import { Session } from './session';
import { Card } from './../cards/card';
import { Plan } from './../plans/plan';

@Component({
  selector:    'sessions',
  templateUrl: './sessions.component.html',
  providers:  [ SessionService, CardsService, HttpClient ]
})
export class SessionsListComponent {
  sessions: Session[];
  cards: Card[];
  selectedSession: Session;
  private socket = new WebSocket("wss://easyanticafedevelop.herokuapp.com/cat/");

  constructor(public dialog: MdDialog,
              private sessionsService: SessionService,
              private cardsService: CardsService) { }

  ngOnInit() {
    let that = this;
    that.getSessions();
    let interval = setInterval(function() {
      that.getSessions();
    }, 5000);
    this.getCards();
    this.socket.onmessage = function(e) {
      that.checkCard(e.data);
    }
  }

  getSessions(): void {
    this.sessionsService
    .getSessions()
    .then((sessions) => {
      this.sessions = sessions
      console.log('Sessions are', this.sessions)
    });
  }

  getCards(): void {
    this.cardsService
    .getCards()
    .then((cards) => {
      this.cards = cards
      console.log('Cards are ready:', this.cards)
    });
  }

  getSessionCardId(session) {
    if (this.cards) {
      let card = this.cards.find(function(item) {
        return item.id === session.card;
      })
      return card.indentifier;
    }
  }

  checkCard(cardId) {
    console.log('Check if card exists', cardId);
    console.log('Cards are', this.cards)
    let card = this.cards.find(function(item) {
      return item.indentifier === cardId;
    })
    if (card) {
      console.log('Card found', card)
      let session = this.sessions.find(function(item) {
        return item.card === card.id;
      })
      console.log('Session found', session)
      let sessionDialog = this.dialog.open(SessionDialog);
      sessionDialog.componentInstance.session = session;
      sessionDialog.afterClosed().subscribe(result => {
        console.log('Result is ', result)
      });

    } else {
      console.log('Card not found')
      let cardDialog = this.dialog.open(NewCardDialog);
      cardDialog.afterClosed().subscribe(result => {
        console.log('Result is ', result)
        if (result.selectedPlan) {
          let card = {
            id: undefined,
            indentifier: cardId,
            plan: result.selectedPlan
          }
          this.cardsService
          .create(card)
          .then((card) => {
            console.log('Card created', card)
            this.cards.push(card)
            this.sessionsService.startSession(cardId).then((res) => {
              console.log('Session started with card', cardId)
              this.sessions.push(res)
            })
          });
        }
      });
    }
  }

  selectSession(session: Session) { this.selectedSession = session; }
}

@Component({
  selector: 'session-dialog',
  templateUrl: './session-dialog.html'
})
export class SessionDialog {
  session: Session
  constructor(public dialogRef: MdDialogRef<SessionDialog>) {}
}

@Component({
  selector: 'new-card-dialog',
  templateUrl: './../cards/new-card-dialog.html',
  providers:  [ PlansService, HttpClient ]
})
export class NewCardDialog {
  private plans: Plan[]
  private selectedPlan: Plan
  constructor(public dialogRef: MdDialogRef<NewCardDialog>,
              private plansService: PlansService) {}

  ngOnInit() {
    let that = this;
    this.getPlans();
  }

  getPlans(): void {
    this.plansService
    .getPlans()
    .then(plans => {
      this.plans = plans
      console.log('Plans are', this.plans)
    });
  }
}

