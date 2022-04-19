import { GeneralService } from '../../providers/general.service';
import { WindowService } from '../../services/window.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ToastController, AlertController, Platform, MenuController } from '@ionic/angular';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { AngularFireAuth } from "@angular/fire/auth";


import firebase from 'firebase/app';
import 'firebase/auth';
import { environment } from '../../../environments/environment';
declare var SMSReceive: any;


@Component({
  selector: 'app-phone',
  templateUrl: './phone.page.html',
  styleUrls: ['./phone.page.scss'],
})
export class PhonePage implements OnInit {


  phone: any;
  userid: string;
  message_sent: boolean
  verifcode: string;
  phone_num: string;
  phoneNumber: any;
  current_view = 0;
  char1 = "";
  char2 = "";
  char3 = "";
  char4 = "";
  char5 = "";
  char6 = "";
  public timer = 60;
  public m = 1;
  timerEnd = false;

  windowRef: any;
  // @ViewChild('char1') char1Input;



  constructor(public statusbar: StatusBar,
    private router: Router,
    private route: ActivatedRoute,
    private alertCtrl: AlertController,
    private win: WindowService,
    private afs: AngularFireAuth,
    public toastController: ToastController,
    public platform: Platform,
    public general: GeneralService,
    public menuCtrl: MenuController
  ) {
    this.statusbar.backgroundColorByHexString('#00B3B7');
  }
  startTimer() {
    this.timer = 60;
    var IntervalVar = setInterval(function () {

      this.timer--;

      if (this.timer === 0) {

        this.timer = 60;

        this.m -= 1;

      }

      if (this.m === 0) {

        this.timer = "00";

        this.m = "00"
        this.timerEnd = true;

        clearInterval(IntervalVar);

      }

    }.bind(this), 1000)
  }

  ngOnInit() {

    this.platform.ready().then(() => {

      this.menuCtrl.swipeGesture(false);
      this.userid = this.route.snapshot.queryParamMap.get('userid');
      console.log('userid from user', this.userid);

      this.message_sent = false;
      firebase.initializeApp(environment.firebaseConfig);

      this.windowRef = this.win.windowRef;
      this.windowRef.recaptchaVerifier = new firebase.auth.RecaptchaVerifier("recaptcha-container",
        { "size": "invisible" }
      );



    });

  }
  ionViewDidEnter() {

  }

  signIn(phoneNumber: number) {

    if ((this.current_view == 0) || (this.current_view == 1 && this.timerEnd)) {


      console.log(this.phoneNumber);
      let tel = "" + this.phoneNumber;
      if (tel.length == 9 && tel.charAt(0) == "6") {
        this.general.showLoader("Patientez...").then(() => {
          const appVerifier = this.windowRef.recaptchaVerifier;
          console.log(appVerifier);
          const phoneNumberString = "+237" + phoneNumber;
          this.phone_num = "+237" + phoneNumber;
          console.log(phoneNumberString);
          console.log(this.phone_num);

          firebase.auth().signInWithPhoneNumber(phoneNumberString, appVerifier)
            .then(async (result) => {
              //Sms successfully sent
              this.windowRef.confirmationResult = result;
              this.message_sent = true;
              this.startTimer();
              this.current_view = 1;
              this.timerEnd = false;
              this.general.stopLoader();
              // this.start();
              // this.char1Input.setFocus();

            })
            .catch(error => {
              console.log(error);
              this.general.showAlertError(error);
              this.general.stopLoader();
            }
            );
        });
      }
      else {
        this.general.showAlertError("Numéro de telephone incorrect");
      }


    }


  }

  // SMS Methods
  start() {
    SMSReceive.startWatch(
      () => {
        console.log('watch started');
        document.addEventListener('onSMSArrive', (e: any) => {
          var IncomingSMS = e.data;
          this.processSMS(IncomingSMS);
        });
      },
      () => {
        console.log('watch start failed');
        this.general.showAlertError("watch start failed");
        this.general.stopLoader();
      }
    )
  }

  stop() {
    SMSReceive.stopWatch(
      () => { console.log('watch stopped') },
      () => { console.log('watch stop failed') }
    )
  }


  processSMS(data) {
    // Check SMS for a specific string sequence to identify it is you SMS
    // Design your SMS in a way so you can identify the OTP quickly i.e. first 6 letters
    // In this case, I am keeping the first 6 letters as OTP
    const message = data.body;
    if (message && message.indexOf('MyApp') != -1) {
      this.verifcode = data.body.slice(0, 6);
      // this.OTPmessage = 'OTP received. Proceed to register'
      this.stop();
      this.verifyOtp();
    }
    else {
      this.general.stopLoader();
    }
  }

  // Sucess displayer
  async successVerifToast() {
    const toast = await this.toastController.create({
      header: 'Suceess Identification',
      message: 'You will be redirected in 3s.',
      duration: 3000,
      animated: true,
      cssClass: "my-custom-class",
      buttons: [
        {
          side: 'end',
          icon: 'checkmark-done-outline',
          text: '',
          handler: () => {
            console.log('Favorite clicked');
          }
        }
      ]
    });
    toast.present();
    toast.onDidDismiss().then((val) => {
      console.log('Toast Dismissed');
      // navigate to user page

      let navigationExtras: NavigationExtras = {
        state: {
          tel: this.phone_num,
          ac_type: ''
        }
      };
      this.router.navigate(['inscription'], navigationExtras);

      // this.router.navigate(['contact'], {queryParams: {userid: this.userid} });
    });
  }



  verifyOtp() {
    // this.start();
    if (this.char1.length > 0 && this.char2.length > 0 && this.char3.length > 0 && this.char4.length > 0 && this.char5.length > 0 && this.char6.length > 0) {
      this.verifcode = this.char1 + this.char2 + this.char3 + this.char4 + this.char5 + this.char6;
      console.log(this.verifcode);
      this.windowRef.confirmationResult
        .confirm(this.verifcode)
        .then(result => {
          // Log the logged user
          console.log(result.user);
          this.general.stopLoader();
          this.successVerifToast();

        })
        .catch(error => {
          console.log(error, "Incorrect code entered?");
          this.general.showAlertError("code de vérification incorrect");
          this.general.stopLoader();
        }
        );
    }
    else {
      this.general.showAlertError("code de vérification incorrect");
      this.general.stopLoader();
    }

  }



}
