import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../services/api.service';
import { MessagingService } from '../../services/messaging.service';
import { StreamService } from '../../services/stream.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { CallnotifService } from './../../services/callnotif.service';

@Component({
  selector: 'app-call',
  templateUrl: './call.page.html',
  styleUrls: ['./call.page.scss'],
})
export class CallPage implements OnInit {

  isvisible: boolean = true;
  togglemic: boolean = false;
  togglevideo: boolean = false;
  togglecam: boolean = false;
  togglevol: boolean = false;
  caller_role:string ="";
  waiting_call_playing:boolean = false;
  person: string = 'Frank le bourgeois du bosc en france';


constructor(
  public stream: StreamService, public api: ApiService,
  public message: MessagingService, private route: ActivatedRoute,
  public callnotif: CallnotifService,
  public statusBar: StatusBar,
  public nativeAudio: NativeAudio,
  private router: Router
) {

  this.statusBar.hide();
  this.stream.updateUserInfo.subscribe(async (id) => {
    if (id) {
      const user = await this.message.rtmclient.getUserAttributes(id.toString()); // senderId means uid getUserInfo
      for (let index = 0; index < this.stream.remoteUsers.length; index++){
        const element = this.stream.remoteUsers[index];
        if (element.uid == id) {
          element.name = user.name;
        }
      }
    }
  });

  this.route.queryParams.subscribe(params => {
    if (this.router.getCurrentNavigation().extras.state) {
      this.person = this.router.getCurrentNavigation().extras.state.call_participant;
      this.caller_role = this.router.getCurrentNavigation().extras.state.role;
      console.log(this.person+'--person loaded');
      console.log(this.caller_role);
      this.startCall();
    }
  });

  // if(this.caller_role == "caller"){
  //    console.log("entrer dans call sound caller");
  //    this.nativeAudio.loop("callSound")
  //    .then(
  //      success => { console.log('playing waiting call'); },
  //      err => console.log(err)
  //    );
  // }
}


ngOnInit() {
   this.nativeAudio.preloadComplex('callSound', 'assets/audio/track_call.mp3', 1, 1, 0).then(() => {
     console.log("callSound registered");
   });
   this.callnotif.getCallResponse().subscribe(response => {
      console.log(response);
      if(response == "appel refusé"){
         console.log('########################## appel refusé ###############################');
         this.endCall();
      }
  });
  this.stream.getJoinedNotif().subscribe(response => {
     console.log(response);
     if(response == "remote published"){
        console.log("=============another test for remote joined=====================");
        this.nativeAudio.stop("callSound");
     }
  });
}

ionViewDidEnter(){
   if(this.caller_role == "caller"){
      console.log("entrer dans call sound caller");
      this.nativeAudio.loop("callSound")
      .then(
        success => { console.log('playing waiting call'); this.waiting_call_playing= true },
        err => console.log(err)
      );
   }
}

ionViewDidLeave() {
  this.statusBar.show();
}

togglebuttons() {
  this.isvisible == true ? this.isvisible = false : this.isvisible = true;
}

callOptions(num_action: number) {
  if (num_action === 1) {
    console.log("mute");
    this.stream.TogglemuteLocalMic(this.stream.rtc.localAudioTrack);
    var btn_mute = document.getElementById("btn_mute");
    this.togglemic == false ? (btn_mute.className += " clicked_mic", this.togglemic = true) : (btn_mute.classList.remove("clicked_mic"), this.togglemic = false);

  } else if (num_action === 2) {
    console.log("reversecam");
    this.stream.reverseCamera(this.stream.rtc.localVideoTrack);
    var btn_cam = document.getElementById("btn_cam");
    this.togglecam == false ? (btn_cam.className += " clicked_cam", this.togglecam = true) : (btn_cam.classList.remove("clicked_cam"), this.togglecam = false);

  } else if (num_action === 3) {
    console.log("offcam");
    this.stream.toggleOffcamera(this.stream.rtc.localVideoTrack);
    var btn_video = document.getElementById("btn_video");
    this.togglevideo == false ? (btn_video.className += " clicked_video", this.togglevideo = true) : (btn_video.classList.remove("clicked_video"), this.togglevideo = false);

  } else if (num_action === 4) {
    console.log("speaker");
    this.stream.switchaudiooutput(this.stream.rtc.localAudioTrack);
    var btn_volume = document.getElementById("btn_volume");
    this.togglevol == false ? (btn_volume.className += " clicked_volume", this.togglevol = true) : (btn_volume.classList.remove("clicked_volume"), this.togglevol = false);
  }

}


async startCall() {
  if (this.person) {
    const uid = this.generateUid();
    const rtcDetails = await this.generateTokenAndUid(uid);

    // rtm
    await this.rtmUserLogin(uid);

    // rtc
    this.stream.createRTCClient();
    this.stream.agoraServerEvents(this.stream.rtc);
    await this.stream.localUser(rtcDetails.token, uid);
    this.stream._local.subscribe(info => {
      // this.togglebuttons();
    });

    var localvideo = document.getElementById("local-player");
    var myvid = localvideo.querySelector("video") as HTMLVideoElement;
    myvid.className += " my_local_video_class";
    myvid.volume = 0;
    myvid.muted = true;

  }
  else {
    alert('Enter name to start call');
  }

}

// rtc token
async generateTokenAndUid(uid) {
  // https://test-agora.herokuapp.com/access_token?channel=test&uid=1234
  let url = 'https://test-agora.herokuapp.com/access_token?';
  const opts = { params: new HttpParams({ fromString: "channel=test&uid=" + uid }) };
  const data = await this.api.getRequest(url, opts.params).toPromise();
  return { 'uid': uid, token: data['token'] }

}

async generateRtmTokenAndUid(uid) {
  // https://sharp-pouncing-grass.glitch.me/rtmToken?account=1234
  let url = 'https://sharp-pouncing-grass.glitch.me/rtmToken?';
  const opts = { params: new HttpParams({ fromString: "account=" + uid }) };
  const data = await this.api.getRequest(url, opts.params).toPromise();
  return { 'uid': uid, token: data['key'] }

}

generateUid() {
  const length = 5;
  const randomNo = (Math.floor(Math.pow(10, length - 1) + Math.random() * 9 * Math.pow(10, length - 1)));
  return randomNo;
}

async rtmUserLogin(uid) {

  this.message.rtmclient = this.message.createRTMClient();

  this.message.channel = this.message.createRtmChannel(this.message.rtmclient);
  const rtmDetails = await this.generateRtmTokenAndUid(uid);

  await this.message.signalLogin(this.message.rtmclient, rtmDetails.token, uid.toString());

  await this.message.joinchannel(this.message.channel);
  await this.message.setLocalAttributes(this.message.rtmclient, this.person)
  this.message.RTMevents(this.message.rtmclient);
  this.message.receiveChannelMessage(this.message.channel, this.message.rtmclient);

}

peertopeer() {
  this.message.sendOneToOneMessage(this.message.rtmclient, this.stream.remoteUsers[0].uid.toString())
}

channelMsg() {
  this.message.sendMessageChannel(this.message.channel);
}

async rtmclientChannelLogout() {
   this.person = '';
   this.stream.getLocaljoined().subscribe(joined  => {
      if(joined== false){
         console.log("interruption de la method d'appel avec leavecall avant join - from call.ts rtmchalogout");
         return;
      }else if(joined == true){
          console.log("arretement de l'appel after joinig channel - from call.ts rtmchalogout");
         this.message.leaveChannel(this.message.rtmclient, this.message.channel);
         this.stream.leaveCall();
      }
   });


}

endCall(){
  this.togglebuttons();
  this.rtmclientChannelLogout().then(call =>{
     console.log("attente de rtmchannellogout fini now back");
     this.router.navigate(['/tab-nav/home']);
 });
 if(this.waiting_call_playing == true){
    this.nativeAudio.stop("callSound");
  }
}

}
