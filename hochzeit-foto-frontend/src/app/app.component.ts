import {Component, Inject, OnInit} from '@angular/core';
import {WebsocketServiceService, WebsocketState} from '../websocket-service.service';
import {NetworkRequestService} from '../network-request.service';

interface LoadingImage {
  url: string;
  error: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  connectedState: WebsocketState = WebsocketState.CONNECTED;

  stateWebsocket: WebsocketState = WebsocketState.DISCONNECTED;

  bigImageSource: string;
  thumbnails = [];

  private imagesLoading: Array<string> = [];
  private imagesErrored: Array<string> = [];

  constructor(
    private networkRequests: NetworkRequestService,
    private wsService: WebsocketServiceService) {}

  ngOnInit(): void {
    this.loadThumbnails(true);

    this.wsService.imageUploaded().subscribe(webSocketEvent => {
      console.log('websocket event:', webSocketEvent);
      if (webSocketEvent.command === 'download-start') {
        this.imagesLoading.push(webSocketEvent.data);
        this.removeElementFromErroredList(webSocketEvent.data);
      } else if (webSocketEvent.command === 'downloaded') {
        this.newImage(webSocketEvent.data);
        this.removeElementFromLoadingList(webSocketEvent.data);
      } else if (webSocketEvent.command === 'error') {
        this.removeElementFromLoadingList(webSocketEvent.data);
      } else {
        console.error('unsupported command:', webSocketEvent.command);
      }
    });

    this.wsService.status().subscribe(state => {
      this.stateWebsocket = state;
    });
  }

  private removeElementFromLoadingList(element: string, error: boolean = false) {
    let index = -1;
    this.imagesLoading.forEach((imageLoading, counter) => {
      if (imageLoading === element) {
        index = counter;
      }
    });

    if (index > -1) {
      if (error) {
        this.imagesErrored.push(this.imagesLoading[index]);
      }
      this.imagesLoading.splice(index, 1);
    }

    if (!error) {
      this.removeElementFromErroredList(element);
    }
  }

  private removeElementFromErroredList(element: string) {
    let index = -1;
    this.imagesErrored.forEach((image, counter) => {
      if (image === element) {
        index = counter;
      }
    });

    if (index > -1) {
      this.imagesErrored.splice(index, 1);
    }
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
        this.bigImageSource = this.thumbnails[0];
      }
    });
  }

  private newImage(path: string) {
    this.bigImageSource = path;

    this.loadThumbnails();
  }
}
