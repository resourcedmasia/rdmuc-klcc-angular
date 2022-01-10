import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private router: Router) { }

  public getToken() {
    return localStorage.getItem("token")
  }

  public getRole() {
    return localStorage.getItem("role")
  }

  public setToken(token: string) {
  	// Save token to localstorage
    localStorage.setItem("token", token);
  }

  public setRole(role: string) {
  	// Save role to localstorage
    localStorage.setItem("role", role);
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
