import { AfterViewInit, Component } from '@angular/core';
import Hls from 'hls.js';
import { Socket, io } from 'socket.io-client'
// import { Socket, io } from 'socket.io';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements AfterViewInit {
  title = 'shared-video';
  private socket!: Socket
  public video: HTMLMediaElement | null | HTMLElement = document.getElementById('video')
  public userSeeked = true
  public time = 0

  constructor() {
    this.socket = io('http://localhost:3000')
  }


  ngAfterViewInit(): void {
    // this.socket.emit('seek', 60)
    const video: HTMLMediaElement | null | HTMLElement = document.getElementById('video')
    const videoSrc = 'https://firebasestorage.googleapis.com/v0/b/video-streaming-e4f77.appspot.com/o/71d24b0f-f609-40bd-9741-6f57c69734b6%2Foutput.m3u8?alt=media'
    this.video = video
    if (video && video instanceof HTMLMediaElement) {
      if (Hls.isSupported()) {
        var hls = new Hls();
        hls.loadSource(videoSrc);
        hls.attachMedia(video);
        this.socket.on('seek', (time) => {
          video.currentTime = time.time
          this.time = time.time
          console.log(this.userSeeked)
          this.userSeeked = !time.userSeeked
        })
        this.socket.on('play', () => {
          video.muted = true
          video.play()
        })
        this.socket.on('pause', () => {

          console.log('pause')
          video.pause()
        })
      }
      else if (video!.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = videoSrc;
      }
    }
  }

  uploadFile(event: any) {
    const file: File = event.target.files[0]
    // upload file logic
  }

  onPause() {
    this.socket.emit('pause')

  }

  onplay() {
    this.socket.emit('play-client')
  }

  handelChange() {
    console.log(this.userSeeked)
    if (this.video && this.video instanceof HTMLMediaElement && this.userSeeked) {
      this.socket.emit('seek', this.video.currentTime, true)

    }
  }

  updateTime() {
    console.log(this.userSeeked)
    if (this.video && this.video instanceof HTMLMediaElement) {
      if (this.video.currentTime > +this.time + 5) {
        this.userSeeked = true
      }
    }

  }

}



// video-player.component.ts
// import { Component, OnInit, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
// import Hls from 'hls.js';

// @Component({
//   selector: 'app-video-player',
//   template: `<video #videoControl controls class="video-player"></video>`,
//   styles: [`
//     .video-player {
//       width: 100%;
//       height: auto;
//     }
//   `]
// })
// export class VideoPlayerComponent implements AfterViewInit {
//   @ViewChild('videoControl') videoElementRef: ElementRef;
//   videoElement: HTMLVideoElement;

//   constructor() { }

//   ngAfterViewInit() {
//     this.videoElement = this.videoElementRef.nativeElement;
//     this.setupHls();
//   }

//   setupHls() {
//     const hls = new Hls();
//     const videoSrc = 'https://path-to-your-hls-playlist.m3u8'; // Replace this with your video's URL

//     if (Hls.isSupported()) {
//       hls.loadSource(videoSrc);
//       hls.attachMedia(this.videoElement);
//       hls.on(Hls.Events.MANIFEST_PARSED, () => {
//         this.videoElement.play();
//       });
//     } else if (this.videoElement.canPlayType('application/vnd.apple.mpegurl')) {
//       this.videoElement.src = videoSrc;
//       this.videoElement.addEventListener('loadedmetadata', () => {
//         this.videoElement.play();
//       });
//     }
//   }
// }
