import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { share, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  // API Endpoint
  // private baseUrl = 'http://10.1.128.75:8080/api/api.php';
  private baseUrl = 'http://wismagenting.uc.rdmsite.com/api/api.php';
  

  
  // Method exports
  postData(method, token = null, data = null) {
    return this.httpClient.post(
      this.baseUrl,
      {
        method: method,
        token: token,
        data: data
      }).pipe(share());
  }

  getConfig() {
    return this.httpClient.get(
      this.baseUrl,
      {
        observe: 'body',
        responseType: 'json'
      }).pipe(shareReplay(1));
  }
}
