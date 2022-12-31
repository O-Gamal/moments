import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  showAlert = false;
  alertMessage = '';
  alertType = '';

  credentials = {
    email: '',
    password: '',
  };

  login() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! your account is being validating';
    this.alertType = 'normal';
  }
}
