import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import {
  AngularFireStorage,
  AngularFireUploadTask,
} from '@angular/fire/compat/storage';
import { v4 as uuid } from 'uuid';
import { AlertType } from 'src/app/shared/alert/alert.component';
import { last, switchMap } from 'rxjs/operators';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';
import { ClipService } from 'src/app/services/clip.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class UploadComponent implements OnDestroy {
  isDragOver = false;
  file: File | null = null;
  fileUploaded = false;
  percentage = 0;

  showAlert = false;
  alertMessage = '';
  alertType: AlertType = '';
  inSubmission = false;

  user: firebase.User | null = null;
  task?: AngularFireUploadTask;

  constructor(
    private storage: AngularFireStorage,
    private auth: AngularFireAuth,
    private clipsService: ClipService,
    private router: Router
  ) {
    auth.user.subscribe((user) => (this.user = user));
  }

  ngOnDestroy(): void {
    this.task?.cancel();
  }

  title = new FormControl('', {
    validators: [Validators.required, Validators.minLength(3)],
    nonNullable: true,
  });

  uploadForm = new FormGroup({
    title: this.title,
  });

  storeFile(e: Event) {
    e.preventDefault();
    this.isDragOver = false;

    this.file = (e as DragEvent).dataTransfer
      ? (e as DragEvent).dataTransfer?.files.item(0) || null
      : (e.target as HTMLInputElement).files?.item(0) || null;

    if (!this.file || this.file.type !== 'video/mp4') {
      return;
    }

    this.title.setValue(this.file.name.replace(/\.[^/.]+$/, ''));
    this.fileUploaded = true;
  }

  uploadFile() {
    this.uploadForm.disable();
    const clipFileName = uuid();
    const clipPath = `clips/${clipFileName}.mp4`;

    this.showAlert = true;
    this.alertMessage = 'Please wait! your clip is being uploaded';
    this.alertType = 'normal';
    this.inSubmission = true;

    this.task = this.storage.upload(clipPath, this.file);
    const clipRef = this.storage.ref(clipPath);

    this.task.percentageChanges().subscribe((progress) => {
      this.percentage = (progress as number) / 100;
    });

    this.task
      .snapshotChanges()
      .pipe(
        last(),
        switchMap(() => clipRef.getDownloadURL())
      )
      .subscribe({
        next: async (url) => {
          const clip = {
            uid: this.user?.uid as string,
            displayName: this.user?.displayName as string,
            title: this.title.value,
            fileName: `${clipFileName}.mp4`,
            url,
          };

          const clipDocRef = await this.clipsService.createClip(clip);

          this.alertMessage = 'Success! Your clip has been published';
          this.alertType = 'success';

          setTimeout(() => {
            this.router.navigate(['clip', clipDocRef.id]);
          }, 1000);
        },
        error: (error) => {
          this.uploadForm.enable();
          console.error(error);
          this.inSubmission = false;
          if (error.code === 'storage/unauthorized') {
            this.alertMessage = 'File is too large !';
          } else {
            this.alertMessage = 'Something went wrong. Please try agin later';
          }
          this.alertType = 'error';
        },
        complete: () => {
          this.inSubmission = false;
        },
      });

    // console.error(error);
    // this.alertMessage = 'Something went wrong. Please try agin later';
    // this.alertType = 'error';
    // this.inSubmission = false;
    // return;

    // this.alertMessage = 'Success! Your clip has been published';
    // this.alertType = 'success';
    // this.inSubmission = true;
  }
}
