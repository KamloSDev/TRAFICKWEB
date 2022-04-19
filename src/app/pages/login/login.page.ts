import { RestapiService } from './../../services/restapi.service';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GeneralService } from '../../providers/general.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, Platform, AlertController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { FCM } from './../../../../plugins/cordova-plugin-fcm-with-dependecy-updated/src/ionic/ngx/FCM';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {



  username = "";
  pass = "";

  constructor(
    public nav: NavController,
    public general: GeneralService,
    public route: Router,
    public statusbar: StatusBar,
    public platform: Platform,
    public rest: RestapiService,
    public menuCtrl: MenuController,
    public navCtrl: NavController,
    public http: HttpClient,
    public alertController: AlertController,
    public fcm: FCM,

  ) { }



  async ngOnInit() {
    this.platform.ready().then(() => {





      this.menuCtrl.swipeGesture(false);
      this.statusbar.backgroundColorByHexString("#00B3B7");
      if (window.localStorage.getItem("LUser") != null) {
        let user = JSON.parse(window.localStorage.getItem("LUser"));
        this.pass = "" + user.password;
        this.username = "" + user.username;
        console.log(this.username);
        console.log(user);
        // this.login();
      }
    });
  }

  login() {
    if (this.pass.length > 0 && this.username.length > 0) {
      console.log(this.pass);
      this.general.showLoader("Connexion...").then(() => {
        this.rest.logUserIn(this.username, this.pass).subscribe((data) => {
          if (data != null) {
            console.log(data);
            let us = data[0];
            let user = us[0];
            console.log(user);
            user.password = this.pass;
            this.general.currentUser = user;
            // this.general.sendPush("LOSTO",this.username+" se connecte un tour",null,"all");
            this.pass = "";
            this.username = "";
            window.localStorage.setItem("LUser", JSON.stringify(user));
            this.general.stopLoader();
            this.nav.navigateRoot("/tab-nav/home");
            // this.nav.navigateRoot('profil');
          }
          else {
            this.general.showAlertError("Nom d'utilisateur ou mot de passe incorrect");
            this.general.stopLoader();
          }

        },
          (error) => {
            this.general.showAlertError("Connexion impossible. verifiez votre connexion internet ");
            this.general.stopLoader();
          });
      });
    }
    else {
      this.general.showAlertError("Veuillez remplir tous les champs");
    }

  }

  goRecouvrement() {
    this.navCtrl.navigateRoot('/recouvrement');
  }

  sendPush(){
    this.general.sendCallPush("Losto","Appel entrant. tapez pour décrocher", null, 'dev');
  }


}
