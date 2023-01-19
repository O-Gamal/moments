import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AboutComponent } from './about.component';
import { PageLayoutComponent } from '../shared/page-layout/page-layout.component';

describe('About Component', () => {
  let fixture: ComponentFixture<AboutComponent>;
  let component: AboutComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutComponent, PageLayoutComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
