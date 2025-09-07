import { Component, Input, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import videojs from 'video.js';
import 'videojs-hotkeys';
import { PlaylistItem } from '@/app/core/models/user.model';

declare const require: any;

@Component({
    selector: 'app-video-player',
    templateUrl: './video-player.component.html',
    styleUrls: ['./video-player.component.scss'],
    standalone: false
})
export class VideoPlayerComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
    @Input() videoTitle!: string;
  @Input() videoUrl?: string = '';
  @Input() playlist: PlaylistItem[] = [];
  @ViewChild('videoElement') videoElement!: ElementRef;

  player: any;
  currentIndex = 0;
  isPlaying = false;
  volume = 1;
  currentTime = 0;
  duration = 0;
  playbackRate = 1;
  isFullscreen = false;
  showPlaylist = true;
  showSettings = false;
  analytics = {
    watchTime: 0,
    pauseCount: 0,
    skipCount: 0,
    qualityChanges: 0
  };

  // Quality options
  qualityLevels = [
    { label: '1080p', value: 1080 },
    { label: '720p', value: 720 },
    { label: '480p', value: 480 },
    { label: '360p', value: 360 }
  ];
  currentQuality = 720;

  // Keyboard shortcuts
  keyboardShortcuts = [
    { key: 'Space', action: 'Play/Pause' },
    { key: '←', action: 'Rewind 10s' },
    { key: '→', action: 'Forward 10s' },
    { key: '↑', action: 'Volume Up' },
    { key: '↓', action: 'Volume Down' },
    { key: 'F', action: 'Fullscreen' },
    { key: 'M', action: 'Mute' }
  ];

  ngOnInit() {
    this.setupKeyboardShortcuts();
  }

  ngAfterViewInit(): void {
    this.initializePlayer();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['videoUrl'] && changes['videoUrl'].currentValue && this.player) {
      this.updateVideo();
      this.trackAnalytics('video_changed');
    }
  }

  initializePlayer() {
    const videoElement = this.videoElement?.nativeElement;
    if (videoElement) {
        this.player = videojs(videoElement, {
            controls: true,
            responsive: true,
            fluid: true,
            aspectRatio: '16:9',
            playbackRates: [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2],
            controlBar: {
                playToggle: true,
                currentTimeDisplay: true,
                timeDivider: true,
                durationDisplay: true,
                progressControl: true,
                volumePanel: true,
                playbackRateMenuButton: true,
                pictureInPictureToggle: true,
                fullscreenToggle: true
            }
        });

        this.setupPlayerEvents();
        this.setupCustomControls();

        if (this.videoUrl) {
            this.updateVideo();
        }
    }
}

  setupPlayerEvents() {
    this.player.on('play', () => {
      this.isPlaying = true;
      this.trackAnalytics('play');
    });

    this.player.on('pause', () => {
      this.isPlaying = false;
      this.analytics.pauseCount++;
      this.trackAnalytics('pause');
    });

    // Time updates
    this.player.on('timeupdate', () => {
      this.currentTime = this.player.currentTime();
      this.analytics.watchTime = this.currentTime;
    });

    this.player.on('loadedmetadata', () => {
      this.duration = this.player.duration();
    });

    // Volume changes
    this.player.on('volumechange', () => {
      this.volume = this.player.volume();
    });

    // Fullscreen
    this.player.on('fullscreenchange', () => {
      this.isFullscreen = this.player.isFullscreen();
    });

    // Error handling
    this.player.on('error', (error: any) => {
      console.error('Video player error:', error);
      this.trackAnalytics('error');
    });

    // Ready event
    this.player.ready(() => {
      console.log('VideoJS player ready');
      this.generateThumbnails();
    });
  }

  setupCustomControls() {
    // Add custom control bar
    const customControlBar = document.createElement('div');
    customControlBar.className = 'custom-controls';
    customControlBar.innerHTML = `
      <div class="custom-control-item">
        <button class="skip-back-btn" title="Previous Video">⏮</button>
        <button class="skip-forward-btn" title="Next Video">⏭</button>
      </div>
      <div class="custom-control-item">
        <button class="playlist-btn" title="Toggle Playlist">📋</button>
        <button class="settings-btn" title="Settings">⚙️</button>
      </div>
    `;

    const playerContainer = this.videoElement.nativeElement.parentElement;
    playerContainer.appendChild(customControlBar);

    // Add event listeners
    customControlBar.querySelector('.skip-back-btn')?.addEventListener('click', () => this.previousVideo());
    customControlBar.querySelector('.skip-forward-btn')?.addEventListener('click', () => this.nextVideo());
    customControlBar.querySelector('.playlist-btn')?.addEventListener('click', () => this.togglePlaylist());
    customControlBar.querySelector('.settings-btn')?.addEventListener('click', () => this.toggleSettings());
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      if (!this.player) return;

      switch(event.code) {
        case 'Space':
          event.preventDefault();
          this.togglePlay();
          break;
        case 'ArrowLeft':
          event.preventDefault();
          this.seekBackward(10);
          break;
        case 'ArrowRight':
          event.preventDefault();
          this.seekForward(10);
          break;
        case 'ArrowUp':
          event.preventDefault();
          this.changeVolume(0.1);
          break;
        case 'ArrowDown':
          event.preventDefault();
          this.changeVolume(-0.1);
          break;
        case 'KeyF':
          event.preventDefault();
          this.toggleFullscreen();
          break;
        case 'KeyM':
          event.preventDefault();
          this.toggleMute();
          break;
      }
    });
  }

  // Playback controls
  togglePlay() {
    if (this.isPlaying) {
      this.player.pause();
    } else {
      this.player.play();
    }
  }

  seekBackward(seconds: number) {
    const currentTime = this.player.currentTime();
    this.player.currentTime(Math.max(0, currentTime - seconds));
    this.trackAnalytics('seek_backward');
  }

  seekForward(seconds: number) {
    const currentTime = this.player.currentTime();
    const duration = this.player.duration();
    this.player.currentTime(Math.min(duration, currentTime + seconds));
    this.trackAnalytics('seek_forward');
  }

  changeVolume(delta: number) {
    const newVolume = Math.max(0, Math.min(1, this.volume + delta));
    this.player.volume(newVolume);
    this.volume = newVolume;
  }

  toggleMute() {
    this.player.muted(!this.player.muted());
  }

  toggleFullscreen() {
    if (this.isFullscreen) {
      this.player.exitFullscreen();
    } else {
      this.player.requestFullscreen();
    }
  }

  // Playlist management
  nextVideo() {
    if (this.playlist.length > 0 && this.currentIndex < this.playlist.length - 1) {
      this.currentIndex++;
      this.playVideoFromPlaylist(this.currentIndex);
      this.analytics.skipCount++;
    }
  }

  previousVideo() {
    if (this.playlist.length > 0 && this.currentIndex > 0) {
      this.currentIndex--;
      this.playVideoFromPlaylist(this.currentIndex);
    }
  }

  playVideoFromPlaylist(index: number) {
    if (this.playlist[index]) {
      this.currentIndex = index;
      this.videoUrl = this.playlist[index].url;
      this.videoTitle = this.playlist[index].title;
      this.updateVideo();
    }
  }

  togglePlaylist() {
    this.showPlaylist = !this.showPlaylist;
  }

  toggleSettings() {
    this.showSettings = !this.showSettings;
  }

  // Quality control
  changeQuality(quality: number) {
    this.currentQuality = quality;
    this.analytics.qualityChanges++;
    this.trackAnalytics('quality_changed', { quality });
  }

  // Playback speed
  changePlaybackRate(rate: number) {
    this.playbackRate = rate;
    this.player.playbackRate(rate);
    this.trackAnalytics('speed_changed', { rate });
  }

  // Thumbnail generation
  generateThumbnails() {
    if (this.player && this.duration > 0) {
      const thumbnailCount = 10;
      const interval = this.duration / thumbnailCount;

      // This would typically integrate with a backend service
      // to generate actual thumbnails at specific timestamps
      console.log('Generating thumbnails for video preview');
    }
  }

  // Picture-in-Picture
  togglePictureInPicture() {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture();
    } else if (this.videoElement.nativeElement.requestPictureInPicture) {
      this.videoElement.nativeElement.requestPictureInPicture();
    }
  }

  // Analytics tracking
  trackAnalytics(event: string, data?: any) {
    console.log('Analytics Event:', event, {
      timestamp: new Date(),
      videoTitle: this.videoTitle,
      currentTime: this.currentTime,
      duration: this.duration,
      ...data,
      analytics: this.analytics
    });

    // Here you would typically send data to your analytics service
    // this.analyticsService.track(event, data);
  }

  updateVideo() {
    if (this.player && this.videoUrl) {
      this.player.src({
        type: 'video/mp4',
        src: this.videoUrl
      });
      this.player.load();
      this.currentTime = 0;
    }
  }

  // Format time helper
  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.player) {
      this.trackAnalytics('session_end', {
        totalWatchTime: this.analytics.watchTime,
        totalPauses: this.analytics.pauseCount,
        totalSkips: this.analytics.skipCount
      });
      this.player.dispose();
    }
    document.removeEventListener('keydown', this.setupKeyboardShortcuts);
  }
}
