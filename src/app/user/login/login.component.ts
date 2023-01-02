import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AlertType } from 'src/app/shared/alert/alert.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  constructor(private auth: AngularFireAuth) {}

  inSubmission = false;
  showAlert = false;
  alertMessage = '';
  alertType: AlertType = '';

  credentials = {
    email: '',
    password: '',
  };

  async login() {
    this.showAlert = true;
    this.alertMessage = "Please wait while we're validating your account";
    this.alertType = 'normal';
    this.inSubmission = true;

    try {
      await this.auth.signInWithEmailAndPassword(
        this.credentials.email,
        this.credentials.password
      );
    } catch (error) {
      console.error(error);
      this.alertMessage = 'Something went wrong! Please try again later.';
      this.alertType = 'error';
      this.inSubmission = false;

      return;
    }

    this.alertMessage = 'Logged in successfully';
    this.alertType = 'success';
  }
}
