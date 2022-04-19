import { Injectable } from '@angular/core';
import AgoraRTC, { IAgoraRTCClient, LiveStreamingTranscodingConfig, ICameraVideoTrack, IMicrophoneAudioTrack, ScreenVideoTrackInitConfig, VideoEncoderConfiguration, AREAS, IRemoteAudioTrack, ClientRole } from "agora-rtc-sdk-ng"
import {Observable, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class StreamService {
  _local = new BehaviorSubject<string>("not yet");
  _remote$ = new BehaviorSubject<string>("");
  togglespeaker:boolean=false;
   togglecam:boolean=false;
   remote_video_published:boolean = false;
   _local_joined = new BehaviorSubject<boolean>(false);


  rtc: IRtc = {
    // For the local client.
    client: null,
    // For the local audio and video tracks.
    localAudioTrack: null,
    localVideoTrack: null,
  };

  options = {
    appId: "7a36be5ad79343f4b12c83066b265f91",  // set your appid here
    channel: "test", // Set the channel name.
    // token: '', // Pass a token if your project enables the App Certificate.
    // uid: null
  };
  remoteUsers: IUser[] = [];       // To add remote users in list
  updateUserInfo = new BehaviorSubject<any>(null); // to update remote users name

  constructor() { }

  createRTCClient() {
    this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });
    // this.rtc.client = AgoraRTC.createClient({ mode: "rtc", codec: "h264" , role: 'audience'});
  }

  getLocaljoined(): Observable<boolean> {
      return this._local_joined.asObservable();
   }

   setLocalJoined(data: boolean) {
      this._local_joined.next(data);
   }

  getJoinedNotif(): Observable<string> {
      return this._remote$.asObservable();
   }

   notifyJoinedRemote(data: string) {
      this._remote$.next(data);
   }

  async switchaudiooutput(localTracks){
     console.log("speaker method entered");
     let dcs = await AgoraRTC.getDevices();
     console.log(dcs);
     let mics = await AgoraRTC.getMicrophones();
     console.log(mics);
     let pcs = await AgoraRTC.getPlaybackDevices();
     console.log(pcs);

     if(this.togglespeaker == false){
        console.log(pcs[0]);
        await localTracks.setPlaybackDevice(pcs[0].deviceId);
        this.togglespeaker = true;
     }else{
        console.log(mics[0]);
        await localTracks.setDevice(mics[0].deviceId);
        this.togglespeaker = false;
     }
  }

  async reverseCamera(localTracks){
     console.log("rear cam");
     let cams = await AgoraRTC.getCameras(); //  all cameras devices you can use
     console.log(cams);
     if(this.togglecam == false){
        await localTracks.setDevice(cams[1].deviceId);
        // let constraints = localTracks.getMediaStreamTrack().getConstraints();
        // constraints.facingMode="environment";
        // console.log("config env selected");
        // localTracks.getMediaStreamTrack().applyConstraints(constraints);
        // console.log("facimd mode changed");
      }else{
           await localTracks.setDevice(cams[0].deviceId);
          // let constraints = localTracks.getMediaStreamTrack().getConstraints();
          // constraints.facingMode="user";
          // console.log("config user selected");
          // localTracks.getMediaStreamTrack().applyConstraints(constraints);
          // console.log("facimd mode muted");
      }
      this.switchVisioner();
  }

   async TogglemuteLocalMic(localTracks){
      if(localTracks.enabled === true){
          localTracks.setEnabled(false);
      }else{
          localTracks.setEnabled(true);
      }
   }

   async toggleOffcamera(localTracks){
      if(localTracks.enabled === true){
          localTracks.setEnabled(false);
      }else{
          localTracks.setEnabled(true);
      }
   }

   switchVisioner(){
      var rmvideo= document.getElementById("remote-videos") ;
      var rmvid= rmvideo.querySelector("video") as HTMLVideoElement;
      rmvid.className += " remote_video_class";
      rmvideo.className += " remote_border";

      var localplayer= document.getElementById("local-player");
      var remoteplayer= document.querySelector(".remote-player");
      var localvideo2 = localplayer.firstChild;
      var remotevideo = remoteplayer.firstChild;
      var oldfull = localplayer.removeChild(localvideo2);
      var other = remoteplayer.removeChild(remotevideo)
      localplayer.append(other);
      remoteplayer.append(oldfull);
   }

  // To join a call with tracks (video or audio)
  async localUser(token, uuid) {
    const uid = await this.rtc.client.join(this.options.appId, this.options.channel,token, uuid).then(uid =>{
      console.log("local join ended");
      this.setLocalJoined(true);
   });

    // Create an audio track from the audio sampled by a microphone.
    this.rtc.localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack();
    var constraintsObject = { echoCancellation: true, noiseSuppression: true, volume:0 };
    this.rtc.localAudioTrack.getMediaStreamTrack().applyConstraints(constraintsObject);

    // Create a video track from the video captured by a camera.
    this.rtc.localVideoTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: "360p_9",
      facingMode: "user"
    });

    // this.rtc.localVideoTrack.setMuted(true);
    // comment it if you want to use your camera
    // this.switchCamera('OBS Virtual Camera', this.rtc.localVideoTrack)
    // Publish the local audio and video tracks to the channel.
    // this.rtc.localAudioTrack.play();

    this.rtc.localVideoTrack.play("local-player");
    // channel for other users to subscribe to it.
    await this.rtc.client.publish([this.rtc.localAudioTrack, this.rtc.localVideoTrack]);
    this._local.next("local published");
  }

  agoraServerEvents(rtc) {
    // 2 used
    rtc.client.on("user-published", async (user, mediaType) => {
      console.log(user, mediaType, 'user-published');
      await rtc.client.subscribe(user, mediaType);

      if (mediaType === "video") {
         // if(this.remoteUsers.length == 0){
            const remoteVideoTrack = user.videoTrack;
            remoteVideoTrack.play('remote-playerlist' + user.uid);
            console.log('remote published1');
         // }else{
         //    const newVideoTrack = user.videoTrack;
         //    newVideoTrack.play('local-player' + user.uid);
         //    console.log('local published again');
         // }

        this.switchVisioner();
        // var rmvideo= document.getElementById("remote-videos") ;
        // var rmvid= rmvideo.querySelector("video") as HTMLVideoElement;
        // rmvid.className += " remote_video_class";
        // rmvideo.className += " remote_border";
        //
        // var localplayer= document.getElementById("local-player");
        // var remoteplayer= document.querySelector(".remote-player");
        // var localvideo2 = localplayer.firstChild;
        // var remotevideo = remoteplayer.firstChild;
        // var oldfull = localplayer.removeChild(localvideo2);
        // var other = remoteplayer.removeChild(remotevideo)
        // localplayer.append(other);
        // remoteplayer.append(oldfull);


      }
      if (mediaType === "audio") {
        const remoteAudioTrack = user.audioTrack;
        remoteAudioTrack.play();
      }
    });

    rtc.client.on("user-unpublished", user => {
      console.log(user, 'user-unpublished');
    });
    rtc.client.on("connection-state-change", (curState, prevState) => {
      console.log("current", curState, "prev", prevState, 'event');
    });

    // 1 used
    rtc.client.on("user-joined", (user) => {
      let id = user.uid;
      // if(this.remoteUsers.length == 0){
         this.remoteUsers.push({ 'uid': +id });
         this.updateUserInfo.next(id);
         console.log("user-joined", user, this.remoteUsers, 'event1');
         //confirmation remote has published video
         console.log('remote video joined');
         this.remote_video_published= true;
         this.notifyJoinedRemote("remote published");
      // }else{
      //    console.log("local user-joined again");
      // }
    });

    rtc.client.on("channel-media-relay-event", (user) => {
      console.log("channel-media-relay-event", user, 'event2');
    });
    rtc.client.on("user-left", (user) => {
      console.log("user-left", user, 'event3');
    });
    rtc.client.on("channel-media-relay-state", (user) => {
      console.log("channel-media-relay-state", user, 'event4');
    });
    rtc.client.on("crypt-error", (user) => {
      console.log("crypt-error", user, 'event5');
    });
    rtc.client.on("exception", (user) => {
      console.log("exception", user, 'event6');
    });
    rtc.client.on("live-streaming-error", (user) => {
      console.log("live-streaming-error", user, 'event7');
    });
    rtc.client.on("live-streaming-warning", (user) => {
      console.log("live-streaming-warning", user, 'event8');
    });
    rtc.client.on("media-reconnect-end", (user) => {
      console.log("media-reconnect-end", user, 'event9');
    });
    rtc.client.on("media-reconnect-start", (user) => {
      console.log("media-reconnect-start", user, 'event10');
    });
    rtc.client.on("network-quality", (user) => {
      // console.log("network-quality", user, 'event11');
    });
    rtc.client.on("stream-fallback", (user) => {
      console.log("stream-fallback", user, 'event12');
    });
    rtc.client.on("stream-type-changed", (user) => {
      console.log("stream-type-changed", user, 'event13');
    });
    rtc.client.on("token-privilege-did-expire", (user) => {
      console.log("token-privilege-did-expire", user, 'event14');
    });
    rtc.client.on("token-privilege-will-expire", (user) => {
      console.log("token-privilege-will-expire", user, 'event15');
    });
    rtc.client.on("volume-indicator", (user) => {
      console.log("volume-indicator", user, 'event16');
    });
    rtc.client.on("track-ended", () => {
      console.log("track-ended", 'event17');
    });
  }

  // To leave channel-
  async leaveCall() {
       // Destroy the local audio and video tracks.
       // test if the local element were already published
       if(this.rtc.localAudioTrack != null && this.rtc.localVideoTrack!= null && this.remoteUsers.length > 0){
         this.rtc.localAudioTrack.close();
         this.rtc.localVideoTrack.close();

         this.rtc.client.remoteUsers.forEach(user => {
           const playerContainer = document.getElementById('remote-playerlist' + user.uid.toString());
           playerContainer && playerContainer.remove();
         });
         await this.rtc.client.leave();

      }else if(this.rtc.localAudioTrack == null && this.rtc.localVideoTrack== null){
         this.getLocaljoined().subscribe(joined  => {
            if(joined== false){
               console.log("interruption de la method d'appel avec leavecall avant join");
               return;
            }else if(joined == true){
               console.log("arretement de l'appel after joinig channel");
               this.rtc.client.leave();
            }
         });
      }
      //
      // }else if(this.rtc.localAudioTrack != null && this.rtc.localVideoTrack!= null && this.remoteUsers.length == 0){
      //    this.rtc.localAudioTrack.close();
      //    this.rtc.localVideoTrack.close();
      //    await this.rtc.client.leave();
      //
      // }else if(this.rtc.localAudioTrack == null && this.rtc.localVideoTrack == null && this.remoteUsers.length == 0){
      //    await this.rtc.client.leave();
      //
      //    // this.rtc.client.on("exception", function(evt) {
      //    //   console.log(evt.code, evt.msg, evt.uid);
      //    // });
      // }

      // this.getLocaljoined().subscribe(joined  => {
      //    if(joined== false){
      //       console.log("interruption de la method d'appel avec leavecall avant join");
      //       this.rtc.localAudioTrack.close();
      //          this.rtc.localVideoTrack.close();
      //       return;
      //    }else if(joined == true){
      //       console.log("arretement de l'appel after joinig channel");
      //       this.rtc.localAudioTrack.close();
      //      this.rtc.localVideoTrack.close();
      //      this.rtc.client.remoteUsers.forEach(user => {
      //        const playerContainer = document.getElementById('remote-playerlist' + user.uid.toString());
      //        playerContainer && playerContainer.remove();
      //      });
      //      this.rtc.client.leave();
      //    }
      // });

  }

}

export interface IUser {
  uid: number;
  name?: string;
}
export interface IRtc {
  client: IAgoraRTCClient,
  localAudioTrack: IMicrophoneAudioTrack,
  localVideoTrack: ICameraVideoTrack
}

    // for (trackName in localTracks) {
    //   var track = localTracks[trackName];
    //   if(track) {
    //   track.stop();
    //   track.close();
    //   localTracks[trackName] = undefined;
    //   }
    //   }
    //   remoteUsers = {}; // clear remote users and player views
    //   localTracks = {};


  // stopAudio() {
  //   this.rtc.localAudioTrack.stop();
  // }

  // clientProp() {
  //   console.log(this.rtc.client.channelName, 'channelName');
  //   console.log(this.rtc.client.localTracks, 'localTracks');
  //   console.log(this.rtc.client.remoteUsers, 'remoteUsers');

  //   console.log(this.rtc.client.uid, 'uid');
  //   console.log(this.rtc.client.getListeners('ee'));

  //   const clientStats = this.rtc.client.getRTCStats();
  //   const clientStatsList = [
  //     { description: "Number of users in channel", value: clientStats.UserCount, unit: "" },
  //     { description: "Duration in channel", value: clientStats.Duration, unit: "s" },
  //     { description: "Bit rate receiving", value: clientStats.RecvBitrate, unit: "bps" },
  //     { description: "Bit rate being sent", value: clientStats.SendBitrate, unit: "bps" },
  //     { description: "Total bytes received", value: clientStats.RecvBytes, unit: "bytes" },
  //     { description: "Total bytes sent", value: clientStats.SendBytes, unit: "bytes" },
  //     { description: "Outgoing available bandwidth", value: clientStats.OutgoingAvailableBandwidth.toFixed(3), unit: "kbps" },
  //     { description: "RTT from SDK to SD-RTN access node", value: clientStats.RTT, unit: "ms" },

  //   ]
  // }
  // trackProp() {
  //   console.log(this.rtc.localAudioTrack.isPlaying, 'isPlaying');
  //   console.log(this.rtc.localAudioTrack.trackMediaType, 'trackMediaType');
  //   console.log(this.rtc.localAudioTrack.getMediaStreamTrack(), 'getMediaStreamTrack()');

  //   const localStats = { audio: this.rtc.localAudioTrack.getStats() };
  //   const localAudioStats = [{ description: "Send audio bit rate", value: localStats.audio.sendBitrate, unit: "bps" },
  //   { description: "Total audio bytes sent", value: localStats.audio.sendBytes, unit: "bytes" },
  //   { description: "Total audio packets sent", value: localStats.audio.sendPackets, unit: "" },
  //   { description: "Total audio packets loss", value: localStats.audio.sendPacketsLost, unit: "" }];

  //   console.log(this.rtc.localVideoTrack.getMediaStreamTrack(), 'localVideoTrack getMediaStreamTrack()');

  //   const localVideoStats = { video: this.rtc.localVideoTrack.getStats() };
  //   const localVideoData = [{ description: "Video capture resolution height", value: localVideoStats.video.captureResolutionHeight, unit: "" },
  //   { description: "Video capture resolution width", value: localVideoStats.video.captureResolutionWidth, unit: "" },
  //   { description: "Video send resolution height", value: localVideoStats.video.sendResolutionHeight, unit: "" },
  //   { description: "Video send resolution width", value: localVideoStats.video.sendResolutionWidth, unit: "" },
  //   { description: "video encode delay", value: Number(localVideoStats.video.encodeDelay).toFixed(2), unit: "ms" },
  //   { description: "Send video bit rate", value: localVideoStats.video.sendBitrate, unit: "bps" },
  //   { description: "Total video bytes sent", value: localVideoStats.video.sendBytes, unit: "bytes" },
  //   { description: "Total video packets sent", value: localVideoStats.video.sendPackets, unit: "" },
  //   { description: "Total video packets loss", value: localVideoStats.video.sendPacketsLost, unit: "" },
  //   { description: "Video duration", value: localVideoStats.video.totalDuration, unit: "s" },

  //   { description: "Total video freeze time", value: localVideoStats.video.totalFreezeTime, unit: "s" }]

  // }
  // To temporary off the video
  // async videoOff() {
  //   this.rtc.localVideoTrack.setEnabled(false);
  // }
  // To on the video
  // videoOn() {
  //   this.rtc.localVideoTrack.setEnabled(true);

  // }
  // async audioVideo() {
  //   // To Capture and audio and video at one time

  //   const [microphoneTrack, cameraTrack] = await AgoraRTC.createMicrophoneAndCameraTracks();
  // }
  // async closeTrackTemp() {
  //   await this.rtc.client.unpublish(this.rtc.localVideoTrack);
  // }
  // Other way to set video quality
  // setVideoQuality() {
  //   this.rtc.localVideoTrack.setEncoderConfiguration("480p_1")
  // }
  // async shareScreen() {
  //   await AgoraRTC.createScreenVideoTrack({
  //     encoderConfig: "1080p_1",   // Set the encoder configurations. encoderConfig- defines image quality and resolution. It is optional field.
  //   }).then(localScreenTrack => {
  //     // publish the tracks here
  //   });
  // }
  // To play any default audio
  // async playAudio() {
  //   const audioFileTrack = await AgoraRTC.createBufferSourceAudioTrack({
  //     source: "https://web-demos-static.agora.io/agora/smlt.flac",
  //   });
  //   audioFileTrack.startProcessAudioBuffer();     // Read the audio file before playback
  //   audioFileTrack.play();
  // }
  // events to handle remote users

  // To switch camera-
  // async switchCamera(label, localTracks) {
  //   let cams = await AgoraRTC.getCameras(); //  all cameras devices you can use
  //   let currentCam = cams.find(cam => cam.label === label);
  //   await localTracks.videoTrack.setDevice(currentCam.deviceId);
  // }
  // To switch audio-
  // async switchMicrophone(label, localTracks) {
  //   let mics = await AgoraRTC.getMicrophones(); // all microphones devices you can use
  //   let currentMic = mics.find(mic => mic.label === label);
  //   await localTracks.audioTrack.setDevice(currentMic.deviceId);
  // }
