import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { SideMenuComponent } from './side-menu.component';
import { NavLinkComponent } from '../nav-link/nav-link.component';
import { By } from '@angular/platform-browser';

describe('SideMenuComponent', () => {
  let component: SideMenuComponent;
  let fixture: ComponentFixture<SideMenuComponent>;
  let mockedAuthService = jasmine.createSpyObj(
    'AuthService',
    ['createUser', 'logout'],
    {
      isAuthenticated$: of(true),
    }
  );

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [SideMenuComponent, NavLinkComponent],
      providers: [{ provide: AuthService, useValue: mockedAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(SideMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a logout button', () => {
    const logoutButton = fixture.debugElement.query(By.css('#logout-btn'));
    const logoutButtonMobile = fixture.debugElement.query(
      By.css('#logout-btn')
    );
    expect(logoutButton)
      .withContext('Logout button did not render in desktop view')
      .toBeTruthy();
    expect(logoutButtonMobile)
      .withContext('Logout button did not render in mobile view')
      .toBeTruthy();

    logoutButton.triggerEventHandler('click', null);
    logoutButtonMobile.triggerEventHandler('click', null);

    const authService = TestBed.inject(AuthService);
    expect(authService.logout)
      .withContext('Could not click logout link')
      .toHaveBeenCalledTimes(2);
  });
});
