import { Component, OnInit } from '@angular/core';
import { AppService } from '../app.service';
import { FormGroup, FormControl } from '@angular/forms';
import { RestService } from '../rest.service';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: [
    '../../vendor/styles/pages/authentication.scss'
  ]
})
export class LoginComponent implements OnInit {
  // Alert handler
  alert = {type: null, msg: null};

  constructor(private appService: AppService, private restService: RestService, private authService: AuthService, private router: Router) {
    this.appService.pageTitle = 'Login';
  }

  // Form input (defaults)
  loginForm = new FormGroup({
    username: new FormControl(''),
    password: new FormControl(''),
    rememberMe: new FormControl(false)
  });

  ngOnInit() {
    // Logout on login page load
    this.authService.logout();
  }

  onSubmit() {
    // Attempt to login
    this.restService.postData("auth", null, {username: this.loginForm.value.username, password: this.loginForm.value.password})
      .subscribe(data => {
        // Successful login
        if (data["status"] == 200) {
          // Reset alert
          this.resetAlert();
          // Save token to localstorage
          this.authService.setToken(data["data"].token);

          //Get Role by Username
          this.restService.postData("getUserRoleByUsername", data["data"].token, { username: this.loginForm.value.username }).subscribe(data => {
            // Success
            if (data["status"] == 200) {
              // Save role to localstorage
              this.authService.setRole(data["data"]["rows"][0].role);
              // Navigate to home page
              this.router.navigate(['/']);
            }
          })
        } else {
          // Display alert
          this.displayAlert("danger", data["data"].msg);
        }
      });
  }

  resetAlert() {
    this.alert = {type: null, msg: null};
  }

  displayAlert(type, msg) {
    this.alert.type = type;
    this.alert.msg = msg;
  }
}