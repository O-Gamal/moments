import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import User from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';

type alertType = 'error' | 'worning' | 'normal' | 'success' | '';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService) {}

  inSubmission = false;

  showAlert = false;
  alertMessage = '';
  alertType: alertType = '';

  registerForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    age: new FormControl<number | null>(null, [
      Validators.required,
      Validators.min(12),
      Validators.max(120),
    ]),
    password: new FormControl('', [
      Validators.required,
      Validators.pattern(
        /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/gm
      ),
    ]),
    confirm_password: new FormControl('', [Validators.required]),
    phone_number: new FormControl(''),
  });

  async register() {
    this.showAlert = true;
    this.alertMessage = 'Please wait! your account is being created';
    this.alertType = 'normal';
    this.inSubmission = true;

    try {
      await this.auth.createUser(this.registerForm.value as User);
    } catch (error) {
      console.error(error);
      this.alertMessage = 'Something went wrong. Please try agin later';
      this.alertType = 'error';
      this.inSubmission = false;
      return;
    }

    this.alertMessage = 'Success! Your account has been created';
    this.alertType = 'success';
  }
}
