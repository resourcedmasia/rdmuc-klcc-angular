import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { LZStringService } from 'ng-lz-string';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router, private LZString: LZStringService) { }

  public getToken() {
    var decompress = this.LZString.decompress(localStorage.getItem("token"));
    return decompress;
  }

  public getRole() {
    var decompress = this.LZString.decompress(localStorage.getItem("role"));
    return decompress;
  }

  public setToken(token: string) {
  	// Save token to localstorage
    localStorage.setItem("token", this.LZString.compress(token));
  }

  public setRole(role: string) {
  	// Save role to localstorage
    localStorage.setItem("role",  this.LZString.compress(role));
  }

  public logout() {
  	localStorage.clear();
  }

  public isLoggedIn() {
  	var token = localStorage.getItem("token");
  	if (token == null || token == "") {
  		return false;
  	} else {
  		return true;
  	}
  }
  
}
