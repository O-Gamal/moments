import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from './modal/modal.component';
import { TabsContainerComponent } from './tabs-container/tabs-container.component';
import { TabComponent } from './tab/tab.component';
import { InputComponent } from './input/input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertComponent } from './alert/alert.component';
import { EventBlockDirective } from './directives/event-block.directive';
import { PageLayoutComponent } from './page-layout/page-layout.component';

@NgModule({
  declarations: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    AlertComponent,
    EventBlockDirective,
    PageLayoutComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    ModalComponent,
    TabsContainerComponent,
    TabComponent,
    InputComponent,
    AlertComponent,
    EventBlockDirective,
    PageLayoutComponent,
  ],
})
export class SharedModule {}
