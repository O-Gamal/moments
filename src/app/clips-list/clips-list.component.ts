import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ClipService } from '../services/clip.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-clips-list',
  templateUrl: './clips-list.component.html',
  styleUrls: ['./clips-list.component.css'],
  providers: [DatePipe],
})
export class ClipsListComponent implements OnInit, OnDestroy, OnChanges {
  @Input() scrollable = false;
  @Input() noOfClips = 6;

  constructor(public clipService: ClipService) {}

  ngOnChanges() {
    this.clipService.getClips(this.noOfClips);
  }

  ngOnInit() {
    if (this.scrollable) {
      window.addEventListener('scroll', this.handleScroll);
    }
  }

  ngOnDestroy() {
    if (this.scrollable) {
      window.removeEventListener('scroll', this.handleScroll);
    }

    this.clipService.resetPageClips();
  }

  handleScroll = () => {
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    if (scrollTop + clientHeight >= scrollHeight) {
      this.clipService.getClips(this.noOfClips);
      console.log(this.noOfClips);

      console.log('bottom');
    }
  };
}
