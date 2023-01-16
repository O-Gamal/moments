import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import Clip from 'src/app/models/clip.model';
import { ClipService } from 'src/app/services/clip.service';
import { ModalService } from 'src/app/services/modal.service';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css'],
})
export class ManageComponent implements OnInit {
  videoOrder = '1';
  userClips: Clip[] = [];
  activeClip: Clip | null = null;

  sort$: BehaviorSubject<string>;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private clipService: ClipService,
    private modal: ModalService
  ) {
    this.sort$ = new BehaviorSubject<string>(this.videoOrder);
  }

  ngOnInit() {
    this.route.queryParams.subscribe((params: Params) => {
      this.videoOrder = params['sort'] || '1';
      this.sort$.next(this.videoOrder);
    });

    this.clipService.getUserClips(this.sort$).subscribe((docs) => {
      this.userClips = [];
      docs.forEach((doc) => {
        this.userClips.push({
          docID: doc.id,
          ...doc.data(),
        });
      });
    });
  }

  sort(event: Event) {
    const { value } = event.target as HTMLSelectElement;
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        sort: value,
      },
    });
  }

  openModal(e: Event, clip: Clip) {
    e.preventDefault();
    this.activeClip = clip;

    this.modal.toggleModal('editClip');
  }

  update(clip: Clip) {
    this.userClips.forEach((element, index) => {
      if (clip.docID === element.docID) {
        this.userClips[index].title = clip.title;
      }
    });
  }

  deleteClip(e: Event, clip: Clip) {
    e.preventDefault();
    this.clipService.deleteClip(clip);

    this.userClips = this.userClips.filter((element) => {
      return element.docID !== clip.docID;
    });
  }

  async copyLinkToClipboard(e: MouseEvent, clipID: string | undefined) {
    e.preventDefault();

    if (!clipID) return;
    const url = `${location.origin}/clip/${clipID}`;
    await navigator.clipboard.writeText(url);
    alert('Link Copied');
  }
}
