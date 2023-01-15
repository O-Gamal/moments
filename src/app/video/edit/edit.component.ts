import {
  Component,
  OnDestroy,
  OnInit,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import Clip from 'src/app/models/clip.model';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ClipService } from 'src/app/services/clip.service';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.css'],
})
export class EditComponent implements OnInit, OnDestroy, OnChanges {
  @Input() activeClip: Clip | null = null;
  @Output() update = new EventEmitter();

  showAlert = false;
  alertMessage = '';
  alertType: AlertType = '';
  inSubmission = false;

  constructor(private modal: ModalService, private clipService: ClipService) {}

  clipId = new FormControl('', {
    nonNullable: true,
  });

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  editForm = new FormGroup({
    title: this.title,
  });

  ngOnInit(): void {
    this.modal.register('editClip');
  }

  ngOnDestroy(): void {
    this.modal.unregister('editClip');
  }

  ngOnChanges(): void {
    if (!this.activeClip) return;

    this.clipId.setValue(this.activeClip.docID!);
    this.title.setValue(this.activeClip.title!);
  }

  async submitUpdateForm() {
    if (!this.activeClip) return;
    this.inSubmission = true;
    this.showAlert = true;
    this.alertMessage = 'Updating the clip, Please wait a second';
    this.alertType = 'normal';

    try {
      await this.clipService.updateClip(this.clipId.value, this.title.value);
    } catch (error) {
      console.error(error);
      this.alertMessage = 'Something went wrong. Please try again later';
      this.alertType = 'error';
      this.inSubmission = false;
      return;
    }

    this.activeClip!.title = this.title.value;
    this.update.emit(this.activeClip);

    this.alertMessage = 'Clip updated successfully';
    this.alertType = 'success';
    this.inSubmission = false;

    setTimeout(() => {
      this.alertMessage = '';
      this.showAlert = false;
      this.modal.toggleModal('editClip');
    }, 1000);
  }
}
