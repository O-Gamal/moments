import { Component, Input } from '@angular/core';

export type AlertType = 'error' | 'worning' | 'normal' | 'success' | '';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
})
export class AlertComponent {
  @Input() alertType = '';
}
