import {
  Component,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-link',
  templateUrl: './nav-link.component.html',
  styleUrls: ['./nav-link.component.css'],
})
export class NavLinkComponent {
  @Input() route = '';
  @Input() shortcut = '1';

  constructor(private router: Router) {}

  @HostListener('document:keydown', ['$event'])
  navigateToPate(e: Event) {
    e.preventDefault();
    if ((e as KeyboardEvent).key === this.shortcut) {
      this.router.navigate(['/', this.route]);
    }
  }
}
