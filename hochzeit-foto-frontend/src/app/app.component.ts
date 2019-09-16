import {Component, Inject, OnInit} from '@angular/core';
import {WebsocketServiceService, WebsocketState} from '../websocket-service.service';
import {LOCAL_STORAGE, StorageService} from 'angular-webstorage-service';
import {NetworkRequestService} from '../network-request.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  connectedState: WebsocketState = WebsocketState.CONNECTED;

  loadingNewImage = false;
  error = null;
  stateWebsocket: WebsocketState = WebsocketState.DISCONNECTED;

  bigImageSource: string;
  thumbnails = [];

  constructor(
    private networkRequests: NetworkRequestService,
    private wsService: WebsocketServiceService) {}

  ngOnInit(): void {
    this.loadThumbnails(true);

    this.wsService.imageUploaded().subscribe(webSocketEvent => {
      console.log('websocket event:', webSocketEvent);
      if (webSocketEvent.command === 'download-start') {
        this.loadingNewImage = true;
      } else if (webSocketEvent.command === 'downloaded') {
        this.loadingNewImage = false;
        this.error = null;
        this.newImage(webSocketEvent.data);
      } else if (webSocketEvent.command === 'error') {
        this.error = webSocketEvent.data;
        this.loadingNewImage = false;
      } else {
        console.error('unsupported command:', webSocketEvent.command);
      }
    });

    this.wsService.status().subscribe(state => {
      this.stateWebsocket = state;
    });
  }

  imageChosen(image: string) {
    this.bigImageSource = image;
  }

  print() {
    window.print();
  }

  private loadThumbnails(lastThumbnailAsBigImage = false) {
    this.networkRequests.getThumbnails().subscribe(thumbnails => {
      this.thumbnails = thumbnails;

      if (lastThumbnailAsBigImage) {
        this.bigImageSource = this.thumbnails[0]
      }
    });
  }

  private newImage(path: string) {
    this.bigImageSource = path;

    this.loadThumbnails();
  }
}
