import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import {IMediaElement, VgApiService} from '@videogular/ngx-videogular/core';
import { HttpService } from './services/http.service';
import { IVedio } from './model/video.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})


export class AppComponent implements OnInit {
  playlist: IVedio[];
  activeVideo: IVedio | null;
  currentIndex: number;
  api!: VgApiService;

  @ViewChild('content', {static: false}) content!: ElementRef;

  constructor(
    private httpService: HttpService,
    private cdref: ChangeDetectorRef,
    private modalService: NgbModal
  ) {
    this.playlist = [];
    this.activeVideo = null;
    this.currentIndex = 0;
  }

  ngOnInit(): void {
    this.getPlayListData();
  }

  private getPlayListData() {
    const $obs = this.httpService.vedioList().subscribe({
      next: (value: any) => {
        if(!value || value.length <= 0) return;
        this.playlist = value;
        this.activeVideo = this.playlist[this.currentIndex];
      },
      error: (err: Error) => {
      },
      complete: () => {
        $obs.unsubscribe();
      },
    });
  }

  onPlayerReady(api: VgApiService) {
    this.api = api;
    this.api.getDefaultMedia().subscriptions.ended.subscribe(() => {
      // Set the video to the beginning
      this.api.getDefaultMedia().currentTime = 0;
    });
  }

  // onPlayerSet(api: any) {
  //   this.api = api;
  //   this.api.getDefaultMedia().subscriptions.loadedMetadata.subscribe(this.startVideo.bind(this));
  //   this.api.getDefaultMedia().subscriptions.ended.subscribe(this.nextVideo.bind(this));
  // }

  private nextVideo() {
    this.currentIndex++;
    if (this.currentIndex === this.playlist.length) {
      this.currentIndex = 0;
    }
    this.activeVideo = this.playlist[this.currentIndex];
  }

  private startVideo() {
    this.api.play();
  }

  public selectedVideo(vedio: IVedio, index: number) {
    this.currentIndex = index;
    this.activeVideo = vedio;
    this.cdref.detectChanges();
    this.openModal();
  }

  private openModal() {
    this.modalService.open(this.content, {size: 'xl', centered: true});
    setTimeout(() => {
      this.startVideo();
    }, 10)
  }
}
