import { Component, OnInit } from '@angular/core';
import { Utilisateur } from './../../models/utilisateur.model';
import { RestapiService } from './../../services/restapi.service';
import { GeneralService } from '../../providers/general.service';
import { MenuController, NavController, Platform, AlertController } from '@ionic/angular';
import { AdvancednavService } from './../../services/advancednav.service';
import { StreamService } from '../../services/stream.service';
import { CallnotifService } from './../../services/callnotif.service';
import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { FCM } from 'plugins/cordova-plugin-fcm-with-dependecy-updated/src/ionic/ngx/FCM';

@Component({
  selector: 'app-testcall',
  templateUrl: './testcall.page.html',
  styleUrls: ['./testcall.page.scss'],
})

export class TestcallPage implements OnInit {

   prenom1 = "nikit";
   nom1 = "Moja";
   telephone1="656911024";
   username1 = "moja";
   pass1 = "moja";
   pass2 = "moja";
   sexe1 = "M";
   account_type1 = 0;

   prenom2 = "falvie";
   nom2 = "Droit au but";
   telephone2 ="699800796";
   username2 = "nono_flavie";
   pass12 = "flavie";
   pass22 = "flavie";
   sexe2 = "M";
   account_type2 = 1;

  constructor(
     public mynav: AdvancednavService,
     public nav: NavController,
     public rest: RestapiService,
     public general: GeneralService,
     public stream: StreamService,
     public callnotif: CallnotifService,
     public nativeAudio: NativeAudio,
     public fcm: FCM
  ) { }

  ngOnInit() {
     // this.nativeAudio.preloadComplex('incomingSound', 'assets/audio/incoming.mp3', 1, 1, 0).then(() => {
     //    console.log("incomingSound registered");
     // });
     // this.nativeAudio.preloadComplex('callSound', 'assets/audio/track_call.mp3', 1, 1, 0).then(() => {
     //   console.log("callSound registered");
     // });
  }

  testspeaker(){
     this.stream.switchaudiooutput(this.stream.rtc.localAudioTrack);
  }
  testreversecam(){
     this.stream.reverseCamera(this.stream.rtc.localVideoTrack);
  }

  testCall(title,msg,topic,tester){
     console.log(tester);
     let currentuser = JSON.parse(localStorage.getItem('LUser'));
     this.callnotif.sendNotifIncomingCall(title,msg,topic,currentuser.username,currentuser.telephone);
     this.mynav.navwithdata("call",tester,"caller");
   }

  logastesterone(){
      this.rest.logUserIn(this.username1, this.pass1).subscribe((data) =>{
           if (data != null) {
            console.log(data);
            let us = data[0];
            let user = us[0];
            console.log(user);
            user.password = this.pass1;
            this.general.currentUser = user;
            // this.general.sendPush("LOSTO",this.username+" se connecte un tour",null,"all");
            this.pass1 = "";
            this.username1 = "";
            window.localStorage.setItem("LUser", JSON.stringify(user));
            this.fcm.subscribeToTopic(user.telephone);
            // this.nav.navigateRoot("/tab-nav/home");
          }
       });
   }

  logastestertwo(){
      this.rest.logUserIn(this.username2, this.pass12).subscribe((data) =>{
           if (data != null) {
             console.log(data);
            let us = data[0];
            let user = us[0];
            console.log(user);
            user.password = this.pass12;
            this.general.currentUser = user;
            // this.general.sendPush("LOSTO",this.username+" se connecte un tour",null,"all");
            this.pass12 = "";
            this.username2 = "";
            window.localStorage.setItem("LUser", JSON.stringify(user));
            this.fcm.subscribeToTopic(user.telephone);
            // this.nav.navigateRoot("/tab-nav/home");
          }
       });
   }








   //----------------------------------------- Sauvegarde code -------------------------------------------

   //-------first tester creation
   // this.username1 = this.username1.toLowerCase();
   // let user = new Utilisateur(this.nom1, this.prenom1, this.username1, this.pass1, this.telephone1, this.sexe1, 'logo.jpg', null, null, null, 0, this.account_type1, null, null, null);
   // user.niveau_id = null;
   // user.categorie = "0";
   // user.specialite_id = null;
   //
   //  this.rest.createUser(user).subscribe((data) =>{
   //     console.log(data);
   //      this.general.sendPush("LOSTO", this.username1 + " new tester", null, "admin");
   //      window.localStorage.setItem("LUser", JSON.stringify(user));
   //       this.fcm.subscribeToTopic(user.telephone);
   //  });

   //-------first tester creation
   // this.username2 = this.username2.toLowerCase();
   // let user = new Utilisateur(this.nom2, this.prenom2, this.username2, this.pass12, this.telephone2, this.sexe2, 'logo.jpg', null, null, null, 0, this.account_type2, null, null, null);
   // user.niveau_id = null;
   // user.categorie = "0";
   // user.specialite_id = null;
   //
   //  this.rest.createUser(user).subscribe((data) =>{
   //     console.log(data);
   //      this.general.sendPush("LOSTO", this.username2 + " new tester", null, "admin");
   //      window.localStorage.setItem("LUser", JSON.stringify(user));
   //       this.fcm.subscribeToTopic(user.telephone);
   //  });

}
