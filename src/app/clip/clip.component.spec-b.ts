import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { ClipComponent } from './clip.component';
import { PageLayoutComponent } from '../shared/page-layout/page-layout.component';
import { FbTimestampPipe } from '../pipes/fb-timestamp.pipe';
import { ClipsListComponent } from '../clips-list/clips-list.component';

describe('ClipComponent', () => {
  let component: ClipComponent;
  let fixture: ComponentFixture<ClipComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [
        ClipComponent,
        PageLayoutComponent,
        FbTimestampPipe,
        ClipsListComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClipComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
