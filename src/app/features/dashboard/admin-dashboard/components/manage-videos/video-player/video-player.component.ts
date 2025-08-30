import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import videojs from 'video.js';

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
    standalone: false
})
export class VideoPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() videoTitle!: string; // تعيين عنوان الفيديو
  @Input() videoUrl?: string = '';
  @ViewChild('videoElement') videoElement!: ElementRef;

  currentVideoUrl: string = ''; // تعريف الخاصية
  currentVideoTitle: string = ''; // تعريف الخاصية
  player: any;

  ngOnInit() {
    this.initializePlayer();
  }

  ngAfterViewInit(): void {
    const videoElement = this.videoElement?.nativeElement as HTMLVideoElement; // تحويل النوع هنا
    if (videoElement) {
        console.log('Initializing VideoJS player...');
        console.log('Video Element:', videoElement);
        console.log('Video Source URL:', videoElement.src); // تحقق من الرابط المصدر

        this.player = videojs(videoElement);

        // إضافة استماع لأحداث الفيديو:
        this.player.on('error', () => {
            console.error('Error event from VideoJS:', this.player.error());
        });

        this.player.ready(() => {
            console.log('VideoJS player is ready');
        });
    } else {
        console.error('Video element not found.');
    }
}


  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl'] && changes['videoUrl'].currentValue) {
      this.updateVideo();
    }

  }

  initializePlayer() {
    const videoElement = document.getElementById('my-video') as HTMLVideoElement; // تحويل النوع هنا
    if (videoElement) {
        videoElement.src = ''; // أو تعيين مصدر آخر إذا لزم الأمر
        this.player = videojs(videoElement, {
            controls: true,
            autoplay: false,
            preload: 'auto',
            fluid: true,
            controlBar: {
                children: [
                    'playToggle',
                    'currentTimeDisplay',
                    'timeDivider',
                    'durationDisplay',
                    'progressControl',
                    'volumePanel',
                    'PlaybackRateMenuButton',
                    'fullscreenToggle'
                ]
            }
        });
    } else {
        console.error('Video element not found');
    }
}

playVideo(url: string, title: string) {
  if (url && title) {
      this.currentVideoUrl = url;
      this.currentVideoTitle = title;
      console.log(`Playing Video: ${title} ${url}`);

      // تأكد من أنك تقوم بتحديث الفيديو بشكل صحيح
      this.updateVideo();
  } else {
      console.error('Invalid video URL or title:', url, title);
  }
}

updateVideo() {
  console.log(`Updating video to: ${this.videoUrl} with title: ${this.videoTitle}`);
  if (this.player && this.videoUrl) {
      this.player.src({ type: 'video/mp4', src: this.videoUrl });
      this.player.play();
  } else {
      console.error('Player not initialized or video URL is invalid.');
  }
}


  ngOnDestroy() {
    if (this.player) {
      this.player.dispose();
    }
  }

  onMetadataLoaded(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    console.log('Video duration: ', video.duration);
  }

  onTimeUpdate(event: Event) {
    const video: HTMLVideoElement = event.target as HTMLVideoElement;
    console.log('Current time: ', video.currentTime);
  }

  changePlaybackSpeed(speed: number): void {
    if (this.player) {
      this.player.playbackRate(speed);
      console.log(`Playback speed set to: ${speed}x`);
    }
  }
}
