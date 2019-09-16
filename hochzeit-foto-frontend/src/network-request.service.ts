import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';

const URL = 'http://localhost/';

@Injectable({
  providedIn: 'root'
})
export class NetworkRequestService {

  constructor(private http: HttpClient) { }

  getThumbnails(): Observable<Array<string>> {
    return this.http.get(URL + 'thumbnails').pipe(
      map((result: object) => (result as Array<string>).map(image => URL + 'images/' + image)),
    );
  }
}
