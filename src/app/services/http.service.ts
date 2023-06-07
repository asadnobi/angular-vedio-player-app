import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';


@Injectable()
export class HttpService {
  private API: string;
  
  constructor(private http: HttpClient) {
    this.API = environment.APIENDPOINT;
  }
  /** get vedio */
  public vedioList() {
    const url: string = this.API + 'poudyalanil/ca84582cbeb4fc123a13290a586da925/raw/14a27bd0bcd0cd323b35ad79cf3b493dddf6216b/videos.json';
    return this.http.get(url);
  }
}