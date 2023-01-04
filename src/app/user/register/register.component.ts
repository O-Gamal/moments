import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import User from 'src/app/models/user.model';
import { AuthService } from 'src/app/services/auth.service';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { RegisterValidators } from '../validators/register-validators';
import { EmailTaken } from '../validators/email-taken';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  constructor(private auth: AuthService, private emailTaken: EmailTaken) {}

  inSubmission = false;

  showAlert = false;
  alertMessage = '';
  alertType: AlertType = '';

  registerForm = new FormGroup(
    {
      name: new FormControl('', [Validators.required, Validators.minLength(3)]),
      email: new FormControl(
        '',
        [Validators.required, Validators.email],
        [this.emailTaken.validate]
      ),
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
    },
    [RegisterValidators.match('password', 'confirm_password')]
  );

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
