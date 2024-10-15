import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
import videojs from 'video.js';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnDestroy, OnChanges {
  @Input() videoTitle!: string; // تعيين عنوان الفيديو
  @Input() videoUrl?: string = '';
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef;

  currentVideoUrl: string = ''; // تعريف الخاصية
  currentVideoTitle: string = ''; // تعريف الخاصية
  player: any;

  ngOnInit() {
    this.initializePlayer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl'] && changes['videoUrl'].currentValue) {
      this.updateVideo();
    }

  }

  initializePlayer() {
    const videoElement = document.getElementById('my-video');
    if (videoElement) {
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
        // تأكد من أنك تضبط عنوان الفيديو هنا أيضًا
        this.player.src({ type: 'video/mp4', src: this.currentVideoUrl });
        this.player.play();
    } else {
        console.error('Invalid video URL or title:', url, title);
    }
}


  updateVideo() {
    console.log(`Updating video to: ${this.videoUrl} with title: ${this.videoTitle}`);
    if (this.player) {
      this.player.src({ type: 'video/mp4', src: this.videoUrl });
      this.player.play();
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
