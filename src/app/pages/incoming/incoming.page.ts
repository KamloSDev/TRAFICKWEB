import { NavController } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { AdvancednavService } from './../../services/advancednav.service';
import { CallnotifService } from './../../services/callnotif.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-incoming',
  templateUrl: './incoming.page.html',
  styleUrls: ['./incoming.page.scss'],
})
export class IncomingPage implements OnInit {

   caller:string="";
   caller_num:string="";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public mynav: AdvancednavService,
    public callnotif: CallnotifService,
    public statusBar: StatusBar,
    public nativeAudio: NativeAudio,
    public navCtrl: NavController
    ) {

      this.statusBar.hide();
      // this.nativeAudio.loop("incomingSound")
      // .then(
      //    success => { console.log('playing incoming sound'); },
      //    err => console.log(err)
      // );

      this.route.queryParams.subscribe(params => {
         if (this.router.getCurrentNavigation().extras.state) {
           this.caller =  this.router.getCurrentNavigation().extras.state.caller;
           this.caller_num =  this.router.getCurrentNavigation().extras.state.caller_num;
         }
      });
  }

  ionViewDidEnter() {
     this.nativeAudio.loop("incomingSound")
     .then(
        success => { console.log('playing incoming sound'); },
        err => console.log(err)
     );
  }

  ngOnInit() {
    this.nativeAudio.preloadComplex('incomingSound', 'assets/audio/incoming.mp3', 1, 1, 0).then(() => {
       console.log("incomingSound registered");
    });
  }

  ionViewDidLeave(){
    this.statusBar.show();
    this.nativeAudio.stop("incomingSound");
   }

   accept() {
      this.callnotif.sendNotifCallResponse("call answer","take call",this.caller_num,undefined,undefined,"accepted");
      this.mynav.navwithdata("call",this.caller,"responder");
   }

   abort() {
      this.callnotif.sendNotifCallResponse("call answer","take call",this.caller_num,undefined,undefined,"rejected");
      this.navCtrl.navigateRoot("/tab-nav/home");
   }

}





// ---------------------------------------- Sauvegarde code ----------------------------------------------------


// ============== code accept method



//    sendPush(title,msg, topic,response){
//        console.log(topic);
//        const httpOptions = {
//          headers: new HttpHeaders({
//          'Content-Type':  'application/json',
//          'Authorization': 'key=AAAALIL6THw:APA91bEHeZFuUF-30q1SnVJB2Jr3oAEvMK7YCR9C8rh2TBOFoNUS-svZkV5qMkpEn-mUjSP3zlgKuHGRYcdWt4gwKoUMs0fM0gENmC8wCml8LI_-ED2VCExi8c-n0hRpk7If-jofg9hn'
//         })
//        };
//
//        let url = 'https://fcm.googleapis.com/fcm/send';
//        let currentuser = JSON.parse(localStorage.getItem('LUser'));
//
//        let notification = {
//          "notification": {
//            "title": title,
//            "body": msg,
//            "click_action": "FCM_PLUGIN_ACTIVITY",
//            "sound": "default",
//            "icon":"../assets/img/logo"
//          },
//          "data": {
//            "title": title,
//            "message": msg,
//            "caller": currentuser.username,
//          },
//            "android":{
//            "ttl":"2419200s"
//          },
//          "to":'/topics/'+topic,
//          "priority": "high"
//        };
//
//        console.log(JSON.stringify(notification));
//
//        this.http.post(url, notification, httpOptions)
//          .subscribe(data => {
//            console.log("notif posté");
//            console.log(data);
//           }, error => {
//            console.log(error);
//            console.log(JSON.stringify(error.json()));
//          });
//      }
// }
