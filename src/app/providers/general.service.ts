import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { AlertController, LoadingController, ToastController } from '@ionic/angular';
import 'rxjs/add/operator/timeout';
import { first } from "rxjs/operators";
import { interval, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  AVATARS_ROOT = "https://api.lostoweb.com/Medias/avatars/";
  STRUCTURES_ROOT = "https://api.lostoweb.com/Medias/structures/";
  isShowingLoader = false;
  loader: any;
  currentUser : any = null;
  filter = null;
  structureForMapMarker = null;
  // structuresCategories = null;
  structureReadPoints: any = [];
  currentReadingStructure = null;

  constructor(public alertController: AlertController,
    public loadingCtrl : LoadingController,
    private transfer: FileTransfer,
    private http: HttpClient,
    public toastController: ToastController) { }

  async showAlert(msg) {
    const alert = await this.alertController.create({
      cssClass: 'general_info_alert',
      message: msg,
      buttons: ['OK']
    });

    await alert.present();
  }


  async presentToastError(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      cssClass: 'toast_error',
      buttons: [
        {
          side: 'start',
          icon: 'close-circle',
          // text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'fermer',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async presentToastSuccess(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      cssClass: 'toast_success',
      buttons: [
        {
          side: 'start',
          icon: 'checkmark-circle',
          // text: 'Favorite',
          handler: () => {
            console.log('Favorite clicked');
          }
        }, {
          text: 'ok',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    toast.present();
  }

  async showAlertError(msg) {
    let ms = "<div class='msg'><div class='content_img'><img src='./assets/imgs/close-circle-outline.svg' class='icon_alert'/></div><p class='text'>"+msg+"</p></div>";
    const alert = await this.alertController.create({
      // cssClass: 'info_alert',
      cssClass:'info_alert',
      // header: "<ion-icon name='home' ></ion-icon>",
      // subHeader: 'Subtitle',
      message: ms,
      buttons: ['Fermer']
    });

    await alert.present();
  }

  async showAlertSuccess(msg) {
    let ms = "<div class='msg'><div class='content_img'><img src='./assets/imgs/checkmark-circle-outline.svg' class='icon_alert'/></div><p class='text'>"+msg+"</p></div>";
    const alert = await this.alertController.create({
      // cssClass: 'info_alert',
      cssClass:'info_alert success',
      // header: "<ion-icon name='home' ></ion-icon>",
      // subHeader: 'Subtitle',
      message: ms,
      buttons: ['Fermer']
    });

    await alert.present();
  }

  async showAlertAbout() {
    let ms = "<div class='msg'><div class='content_img'><img src='./assets/imgs/icon.png' class='icon_alert logo_about'/><p class='version'>version 2.3.5</p></div><p class='text'>There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised</p></div>";
    const alert = await this.alertController.create({
      // cssClass: 'info_alert',
      cssClass:'info_alert about_alert',
      // header: "<ion-icon name='home' ></ion-icon>",
      // subHeader: 'Subtitle',
      message: ms,
      buttons: ['Ok']
    });

    await alert.present();
  }



  async showLoader(msg) {
    if (!this.isShowingLoader) {
      this.isShowingLoader = true
      this.loader = await this.loadingCtrl.create({
        cssClass: "loader",
        message: msg,
      });
      return await this.loader.present();
    }
  }
  async stopLoader() {
    if (this.loader) {
      this.loader.dismiss()
      this.loader = null
      this.isShowingLoader = false
    }
    else{
      console.log("errror when stoping loader");
    }
  }

  async presentToasTop(msg) {
    const toast = await this.toastController.create({
      // header: 'Toast header',
      message: msg,
      position: 'bottom',
      duration: 3000,
    });
    await toast.present();

    const { role } = await toast.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  validateEmail(email) {
    const regularExpression = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return regularExpression.test(String(email).toLowerCase());
  }

  validateUrl(url): any {
    if(!(url.includes("http://") || url.includes("https://") || url.includes("http://www.") || url.includes("https://www."))   ){
      url = "http://www."+url;
    }
    console.log(url);
    // return this.http
    //   .get(url)
    //   .timeout(5000);
    let source = interval(3000);
    source.subscribe(() => {
      this.http.get(url, { observe: 'response' })
      .pipe(first())
      .subscribe(resp => {
        if (resp.status === 200 ) {
          console.log(true)
        } else {
          console.log(false)
        }
      }, err => console.log(err));
    });
  }


  async uploadPic(image, image_name) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: image_name+".jpg",
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    return fileTransfer.upload(image, "https://api.lostoweb.com/upload.php", options);
  }

  async uploadLogoStructure(image, image_name): Promise<any> {
    const fileTransfer: FileTransferObject = this.transfer.create();
    let fileName = image_name+".jpg";
    let options: FileUploadOptions = {
      fileKey: "image",
      fileName: fileName,
      chunkedMode: false,
      mimeType: "image/jpeg",
      headers: {}
    }

    // return fileTransfer.upload(image, "https://api.lostoweb.com/upload_logo_structure.php", options);

  return new Promise(resolve => {
    fileTransfer.upload(image, "https://api.lostoweb.com/upload_logo_structure.php", options)
      .then((data: any) => {
        resolve(fileName);
      }, error => {
        resolve(-1);
      });
  });
  }

  sendPush(title,msg, data, topic){
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'key=AAAALIL6THw:APA91bEHeZFuUF-30q1SnVJB2Jr3oAEvMK7YCR9C8rh2TBOFoNUS-svZkV5qMkpEn-mUjSP3zlgKuHGRYcdWt4gwKoUMs0fM0gENmC8wCml8LI_-ED2VCExi8c-n0hRpk7If-jofg9hn'
     })
    };

    let url = 'https://fcm.googleapis.com/fcm/send';

    let notification = {
      "notification": {
        "title": title,
        "body": msg,
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "sound": "default",
        "icon":"../assets/img/logo"
      }, "data": data
      ,
        "android":{
        "ttl":"2419200s"
      },
      "to":'/topics/'+topic,
      "priority": "high"
    };


    this.http.post(url, notification, httpOptions)
      .subscribe(data => {
        console.log(data);
       }, error => {
        console.log(error);
        console.log(JSON.stringify(error.json()));
      });


  }

  sendCallPush(title,msg, data, topic) {
    const httpOptions = {
      headers: new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization': 'key=AAAALIL6THw:APA91bEHeZFuUF-30q1SnVJB2Jr3oAEvMK7YCR9C8rh2TBOFoNUS-svZkV5qMkpEn-mUjSP3zlgKuHGRYcdWt4gwKoUMs0fM0gENmC8wCml8LI_-ED2VCExi8c-n0hRpk7If-jofg9hn'
     })
    };

    let url = 'https://fcm.googleapis.com/fcm/send';

   let notification = {
      "notification": {
        "title": title,
        "body": msg,
        "vibrate": "true",
        "sound":"../assets/incoming.mp3",
        "color": '#000000',
        "click_action": "FCM_PLUGIN_ACTIVITY",
      },
      "actions": [
          {
            "title": "Subscribe",
            "action": "subscribe",
          },
          {
            "title": "Unsubscribe",
            "action": "unsubscribe"
          }
        ]
      ,
        "android":{
        "ttl":"2419200s",
        "vibrate": "true",
        "sound":"../assets/incoming.mp3",
              "clearBadge": true,
              "color": '#000000',
              "icon": 'icon',
              "clearNotifications": true,
              "actions": [
                {
                  "title": "Subscribe",
                  "action": "subscribe",
                },
                {
                  "title": "Unsubscribe",
                  "action": "unsubscribe"
                }
              ]
            ,
      },
      "to":'/topics/'+topic,
      "priority": "high"
    };

    let body = {
      "to": '/topics/'+topic,
      "priority": "high",
      "notification": {
        "sound": "./assets/audio/incoming.mp3",
        "title": "Check this Mobile (title)",
        "body": "Rich Notification testing (body)",
        },
        "click_action": "FCM_PLUGIN_ACTIVITY",
        "actions": [
          {
            "title": "Like",
            "action": "like",

          },
          {
            "title": "Unsubscribe",
            "action": "unsubscribe",

          }
        ],
     "data": {
      "url": "<url of media image>",
      "dl": "<deeplink action on tap of notification>",
      "type": "call"
        }
  }


    this.http.post(url, body, httpOptions)
      .subscribe(data => {
        console.log(data);
       }, error => {
        console.log(error);
        console.log(JSON.stringify(error.json()));
      });



  }

  getArrayItemPerId(id, tab){
    let i = 0;
      let res = 1;
      let retour = null;
    if(tab.length>0){
      do{
        let elt = tab[i];
        if(elt.id == id){
          retour = elt;
        }
        i++;
      }
      while(i<tab.length && res == 1);
    }
    return retour;
  }

  getNotePerMedecin(id, tablo) {
    let retour = {total:0, vote:0};
    tablo.forEach(elt => {
      if(elt.medecin_id == id){
        retour.vote++;
        retour.total+= elt.note;
      }
    });
    return retour;
  }


  getDay(i){
    console.log(i);
    let d = "";
    if(i == 1){
      d = "lundi";
    }
    if(i == 2){
      d = "mardi";
    }
    if(i == 3){
      d = "mercredi";
    }
    if(i == 4){
      d = "jeudi";
    }
    if(i == 5){
      d = "vendredi";
    }
    if(i == 6){
      d = "samedi";
    }
    if(i == 7){
      d = "dimanche";
    }
    console.log(d);
    return d;
  }

}

