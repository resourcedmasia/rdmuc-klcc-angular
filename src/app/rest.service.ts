import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RestService {

  constructor(private httpClient: HttpClient) { }

  // API Endpoint
  // private baseUrl = 'https://www.rdmuc.com/api/api.php';
  private baseUrl = 'http://10.1.128.102:8080/api/api.php';

  
  // Method exports
  postData(method, token = null, data = null) {
    return this.httpClient.post(
      this.baseUrl,
      {
        method: method,
        token: token,
        data: data
      });
  }

  getConfig() {
    return this.httpClient.get(
      this.baseUrl,
      {
        observe: 'body',
        responseType: 'json'
      })
  }
}
