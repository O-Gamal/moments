import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { TabsContainerComponent } from './tabs-container.component';
import { TabComponent } from '../tab/tab.component';
import { By } from '@angular/platform-browser';

@Component({
  selector: 'app-mock-tabs-container',
  template: `
    <app-tabs-container>
      <app-tab tabTitle="title1">Tab 1</app-tab>
      <app-tab tabTitle="title2">Tab 2</app-tab>
    </app-tabs-container>
  `,
})
class MockTabsContainerComponent {}

describe('TabsContainerComponent', () => {
  let component: MockTabsContainerComponent;
  let fixture: ComponentFixture<MockTabsContainerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        TabsContainerComponent,
        TabComponent,
        MockTabsContainerComponent,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MockTabsContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have two tabs', () => {
    const tabs = fixture.debugElement.queryAll(By.css('li'));
    const containerComponent = fixture.debugElement.query(
      By.directive(TabsContainerComponent)
    );
    const tabsProp = containerComponent.componentInstance.tabs;

    expect(tabs.length).withContext('Tabs did not render').toBe(2);
    expect(tabsProp.length)
      .withContext('Could not grab component property')
      .toBe(2);
  });
});
