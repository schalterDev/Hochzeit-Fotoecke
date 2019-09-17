import { Injectable } from '@angular/core';
import {observable, Observable, Observer, Subject, Subscriber} from 'rxjs';
import {WebSocketResponse} from './app/websocketResponse';

const URL = 'ws://localhost';

@Injectable({
  providedIn: 'root'
})
export class WebsocketServiceService {

  private stateSubscribers: Array<Observer<WebsocketState>> = [];
  private dataSubscribers: Array<Observer<MessageEvent>> = [];

  constructor() {  }

  private sendState(state: WebsocketState) {
    this.stateSubscribers.forEach((obs) => {
      if (!obs.closed) {
        obs.next(state);
      }
    });
  }

  private connect(): WebSocket {
    this.sendState(WebsocketState.CONNECTING);

    const ws = new WebSocket(URL);

    ws.onopen = (event) => {
      this.sendState(WebsocketState.CONNECTED);
    };

    ws.onclose = (event: CloseEvent) => {
      this.sendState(WebsocketState.DISCONNECTED);

      // reconnect
      this.connect();
    };

    ws.onmessage = (event) => {
      this.dataSubscribers.forEach((subscriber) => {
        if (!subscriber.closed) {
          subscriber.next(JSON.parse(event.data));
        }
      });
    };

    ws.onerror = (event: Event) => {
      this.dataSubscribers.forEach((subscriber) => {
        if (!subscriber.closed) {
          subscriber.error(event);
        }
      });
    };

    return ws;
  }

  status(): Observable<WebsocketState> {
    return new Observable((observer: Observer<WebsocketState>) => {
      this.stateSubscribers.push(observer);
    });
  }

  imageUploaded(): Observable<WebSocketResponse> {
    const ws = this.connect();

    const observableObject = new Observable((obs: Observer<MessageEvent>) => {
      this.dataSubscribers.push(obs);
    });

    const observer = {
      next: (data: string) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(data);
        }
      }
    };

    return Subject.create(observer, observableObject);
  }
}

export enum WebsocketState {
  DISCONNECTED = 'Verbindung getrennt',
  CONNECTED = 'Verbunden',
  CONNECTING = 'Verbinde...'
}
