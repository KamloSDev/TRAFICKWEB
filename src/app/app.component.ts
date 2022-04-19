import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { Component } from '@angular/core';
import { FCM } from './../../plugins/cordova-plugin-fcm-with-dependecy-updated/src/ionic/ngx/FCM';
import { GeneralService } from './providers/general.service';
import { AlertController, MenuController, NavController, Platform } from '@ionic/angular';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { NgxPermissionsService } from 'ngx-permissions';
import { Router, NavigationExtras } from '@angular/router';
import { AdvancednavService } from './services/advancednav.service';
import { CallnotifService } from './services/callnotif.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {

  perm = ["ADMIN", "MEDIA", "VIDEO_CAPTURE", "AUDIO_CAPTURE"];
  user: any;


  constructor(
    public mynav: AdvancednavService,
    public callnotif: CallnotifService,
    public alertController: AlertController,
    public platform: Platform,
    public permissionsService: NgxPermissionsService,
    private androidPermissions: AndroidPermissions,
    public menuCtrl: MenuController,
    public nav: NavController,
    public general: GeneralService,
    public router: Router,
    public fcm: FCM,
    public nativeAudio: NativeAudio
  ) {



    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.CAMERA).then(
      result => console.log('Has permission?', result.hasPermission),
      err => this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA)
    );

    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then(
      result => console.log('Has record audio permission?', result.hasPermission),
      err => {
        this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.RECORD_AUDIO).then((data: any) => {
          if (data.hasPermission) {
            console.log("have record audio permission");
          }
        });
      }
    );

    this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA, this.androidPermissions.PERMISSION.RECORD_AUDIO, this.androidPermissions.PERMISSION.GET_ACCOUNTS]);


    this.platform.ready().then(() => {
      this.user = this.general.currentUser;

      // get FCM token
      this.fcm.getToken().then(token => {
        console.log(token);
      });

      // this.fcm.getInitialPushPayload().then((payload) => {
      //
      //   if(payload.wasTapped) {
      //     console.log("Received FCM when app is closed -> ", JSON.stringify(payload));
      //     // call your function to handle the data
      //
      //   }
      //
      // });

      // ionic push notification example
      this.fcm.onNotification().subscribe(data => {

        if (data.wasTapped) {
          console.log('Received in background');

          if (data.type && data.type == "call") {

             if(data.title != "call answer"){
                 this.mynav.navIncomming("incoming", data.caller, data.caller_id);
             }
         }
        } else {
          console.log('Received in foreground');
          console.log("notif data ",data);

          if(data.type == "call") {

             if(data.title == "call answer"){
                if(data.response == "rejected"){
                   console.log('tin din din ');
                    this.callnotif.notifyCallResponse("appel refusé");
                 }else{
                     this.callnotif.notifyCallResponse("appel accepté");
                 }
             }

             if(data.title == "outgoing call"){
                this.mynav.navIncomming("incoming", data.caller, data.caller_id);
             }

           }
         }
      });


      this.fcm.onTokenRefresh().subscribe(token => {
        console.log(token);
      });

      this.fcm.subscribeToTopic("all");


    });



  }


  initializeApp() {
    this.permissionsService.loadPermissions(this.perm);
    this.checkpermission();

    this.platform.ready().then(() => {
      // this.statusBar.styleDefault();
      // this.splashScreen.hide();


    });
  }

  takeCall(repsonder_name) {
    // let message = title.split(":");
    // let otherparticipant = message[1];
    console.log("in takecall");
    let navigationExtras: NavigationExtras = {
      state: {
        // j'envoi mon nom
        call_participant: repsonder_name
      }
    };
    // this.nav.navigateRoot('call',navigationExtras);
    this.router.navigate(['call'], navigationExtras);
  }

  async checkpermission() {

    this.permissionsService.hasPermission(this.perm).then(success => {
      if (success) {

        if (this.platform.is("android")) {

          this.androidPermissions.requestPermissions([this.androidPermissions.PERMISSION.CAMERA,
          this.androidPermissions.PERMISSION.RECORD_AUDIO,
          this.androidPermissions.PERMISSION.READ_EXTERNAL_STORAGE,
          this.androidPermissions.PERMISSION.WRITE_EXTERNAL_STORAGE]).then((result: any) => {
            if (result.hasPermission)
              console.log("permission granted")// this.start()
            else
              console.log('Permission error')
          }, err => {
            console.log('Media Device Permission Not Granted')
          })

        } else {
          console.log("other platform") //
        }

      } else {
        this.permissionsService.loadPermissions(this.perm)
        this.permissionsService.hasPermission(this.perm).then(success => {
          if (success) {
            console.log("permission granted")// this.start()
          } else {
            console.log('Permission error')
          }
        })
      }
    })
  }


}









// -------------------------------------- Sauvegarde code -------------------------------------------------

// --------------manage call notification


         // console.log(data.caller);
         //  this.takeCall(data.caller);
         //
         // if (data.type && data.type == "call") {
         //   this.router.navigate(['/call']);
         // }

           // console.log(data.caller);
           //  this.takeCall(data.caller);
          //  let navigationExtras: NavigationExtras = {
          //    state: {
          //      // j'envoi mon nom
          //      caller: data.caller,
          //      caller_num: data.caller_id
          //    }
          //  };
          // this.router.navigate(['/incoming'], navigationExtras);

          // if(data.title == "appel accepté"){
          //    this.mynav.navwithdata("call",data.caller);
             // this._responder.next("start call");
              //   let navigationExtras: NavigationExtras = {
              //    state: {
              //      call_participant: data.caller,
              //    }
              //  };
              // this.router.navigate(['/call'], navigationExtras);
           // }
