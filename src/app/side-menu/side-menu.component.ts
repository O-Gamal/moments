import { Component } from '@angular/core';
import { ModalService } from '../services/modal.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css'],
})
export class SideMenuComponent {
  mainNavLinks = [
    {
      label: 'Latest Clips',
      path: '/',
      shortcut: '1',
    },
    {
      label: 'About Moments',
      path: 'about',
      shortcut: '2',
    },
  ];

  userNavLinks = [
    {
      label: 'Upload A Clip',
      path: 'upload',
      shortcut: '3',
    },
    {
      label: 'Manage My Clips',
      path: 'manage',
      shortcut: '4',
    },
  ];

  constructor(public modal: ModalService, public auth: AuthService) {}

  openModal($event: Event) {
    $event.preventDefault();
    this.modal.toggleModal('auth');
  }
}
