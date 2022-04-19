import { AlertController } from '@ionic/angular';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AdvancednavService } from './../../services/advancednav.service';
import { CallnotifService } from './../../services/callnotif.service';
import { RestapiService } from './../../services/restapi.service';
import { GeneralService } from './../../providers/general.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationExtras } from '@angular/router';

@Component({
  selector: 'app-doctor',
  templateUrl: './doctor.page.html',
  styleUrls: ['./doctor.page.scss'],
})
export class DoctorPage implements OnInit {

  doctor: any;
  user:any;
  giftedNote = 0;
  nbConsultation = 0;
  consultation_type = 0;
  lastDemande = null;
  full_debut = "";
  full_fin = "";
  full_hd = "";
  full_hf = "";

  constructor(
    // private http:HttpClient,
    public mynav: AdvancednavService,
    public callnotif: CallnotifService,
    public active: ActivatedRoute,
    public general: GeneralService,
    public route: Router,
    public rest: RestapiService,
    public alertController: AlertController
  ) { }

  ionViewWillEnter() {
    this.ngOnInit();
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('LUser'));
    console.log(this.user);
    console.log(this.user.nom+" "+this.user.prenom);


    this.active.queryParams.subscribe(params => {
      if (params && params.data) {
        this.doctor = JSON.parse(params.data);
        console.log(this.doctor);
        console.log(this.doctor.note);
      } else {

      }
    });
    this.getUserPlaning();
    this.getEvaluationPerUserAndMedecin();
    this.getPassedDemandePerMedecin();
    this.checkUnpassedConsultation();
  }


  launchCall(title,msg, topic){
     let currentuser = JSON.parse(localStorage.getItem('LUser'));
     this.callnotif.sendNotifIncomingCall(title,msg,topic,currentuser.username,currentuser.telephone);
     let doctor_name = "Dr "+this.doctor.prenom+" "+this.doctor.nom;
     this.mynav.navwithdata("call",doctor_name,"caller");
   }

  goDiscussion() {
    if (this.doctor.username != this.general.currentUser.username) {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          destinataire: JSON.stringify(this.doctor)
        }
      };

      this.route.navigate(['discussion'], navigationExtras);
    }
    else {
      this.general.showAlertError("Opération impossible");
    }

  }

  saveEvaluation(note) {
    this.giftedNote = note;
    let eva = {
      user_id: this.general.currentUser.id,
      medecin_id: this.doctor.id,
      note: note
    };
    this.rest.saveEvaluation(eva).subscribe((data) => {
      this.general.presentToasTop("votre note a été enregistrée !!!");
    },
      (error) => {
        this.giftedNote = this.doctor.note;
        console.log(error);
        this.general.presentToasTop("Impossible d'enregistrer votre note");
      });
  }

  getEvaluationPerUserAndMedecin() {

    this.rest.getEvaluationPerUserAndMedecin(this.general.currentUser.id, this.doctor.id).subscribe((data) => {
      if (data[0] != null) {
        this.giftedNote = data[0].note;
        console.log(data);
      }
    },
      (error) => {
        console.log(error);
        this.general.presentToasTop("Impossible d'enregistrer votre note");
      });
  }

  getPassedDemandePerMedecin() {

    this.rest.getPassedDemandePerMedecin(this.doctor.id, 1).subscribe((data) => {
      if (data[0] != null) {
        this.nbConsultation = data.length;
        console.log(data);

      }
    },
      (error) => {
        console.log(error);
        // this.general.presentToasTop("Impossible d'enregistrer votre note");
      });
  }

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      cssClass: 'my-class5',
      message: "Type de consultation",
      // header: 'Radio',
      inputs: [
        {
          name: '1',
          type: 'radio',
          label: 'Video',
          value: '1',
          handler: () => {
            this.consultation_type = 0;
          },
          checked: true
        },
        {
          name: '2',
          type: 'radio',
          label: 'Audio',
          value: '2',
          handler: () => {

            this.consultation_type = 1;
          }
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {

          }
        }, {
          text: 'Envoyer',
          handler: () => {
            let eva = {
              type: this.consultation_type,
              patient: this.general.currentUser.id,
              medecin: this.doctor.id,
              statut: -1
            };
            this.saveDemande(eva);
          }
        }
      ]
    });

    await alert.present();
  }

  saveDemande(eva) {
    this.general.showLoader("Enregistrement...");
    this.rest.saveDemande(eva).subscribe((data) => {
      // this.general.presentToasTop("votre demande a été enregistrée !!!");
      this.lastDemande = eva;
      let asker = this.general.currentUser.prenom + " " + this.general.currentUser.nom;
      console.log("send push to " + this.doctor.username);
      let msg = asker + " vous a envoyé une demande de consultation ";
      // if (this.consultation_type == 1) {
      //   msg = asker + " vous a envoyé une demande de consultation ";
      // }
      this.general.stopLoader();
      this.general.sendPush("LOSTO", msg, null, this.doctor.username);
      this.general.presentToasTop("Demande de consultation envoyée !!!");
    },
      (error) => {
        console.log(error);
        this.general.presentToasTop("Impossible d'enregistrer votre demande");
        this.general.stopLoader();

      });
  }

  deleteDemande() {
    this.general.showLoader("Annulation...");
    this.rest.deleteDemande(this.lastDemande.id).subscribe((data) => {
      this.lastDemande = null;
      let asker = this.general.currentUser.prenom + " " + this.general.currentUser.nom;
      let msg = asker + " vous a annulé sa demande de consultation ";
      this.general.sendPush("LOSTO", msg, null, this.doctor.username);
      this.general.stopLoader();
      this.general.presentToasTop("Demande de consultation annulée !!!");
    },
      (error) => {
        console.log(error);
        this.general.presentToasTop("Impossible d'annuler votre demande. Réessayze plus tard");
        this.general.stopLoader();

      });
  }

  checkUnpassedConsultation() {
    this.rest.getDemandePerPatientAndMedecin(this.general.currentUser.id, this.doctor.id).subscribe((data) => {
      this.lastDemande = data[0];
      console.log(data);
    },
      (error) => {
        this.giftedNote = this.doctor.note;
        console.log(error);
        // this.general.presentToasTop("Impossible d'enregistrer votre demande");
      });
  }

  getUserPlaning() {
    // this.general.showLoader("Chargement...").then(() => {
    this.rest.getPlaningPerUser(this.doctor.id).subscribe((data) => {
      let planing = data[0];
      if (data[0] != null) {
        this.full_debut = this.general.getDay(planing.debut);
        this.full_fin = this.general.getDay(planing.fin);
        let hd = planing.heure_debut;
        this.full_hd = hd.substr(0, 2) + "h" + hd.substr(2, 3);
        let hf = planing.heure_fin;
        this.full_hf = hf.substr(0, 2) + "h" + hf.substr(2, 3);
      }

      console.log(data);

      this.general.stopLoader();
    },
      (error) => {
        console.log(error);
        this.general.showAlertError("Il y'a eu une erreur pendant le chargement !!!");
        this.general.stopLoader();
      });
  }
}


// ---------------------------------------- Sauvegarde code ----------------------------------------------------


// ========= code launchCall
// this.sendPush(title,msg, topic);
// console.log(doctor_name);
//
// let navigationExtras: NavigationExtras = {
//    state: {
//       // j'envoi mon nom
//      call_participant: doctor_name
//    }
// };
// this.route.navigate(['call'], navigationExtras);


// ========= code senpush methode
// sendPush(title,msg, topic){
//     // alert("sending private push");
//     console.log(topic);
//     const httpOptions = {
//       headers: new HttpHeaders({
//       'Content-Type':  'application/json',
//       'Authorization': 'key=AAAALIL6THw:APA91bEHeZFuUF-30q1SnVJB2Jr3oAEvMK7YCR9C8rh2TBOFoNUS-svZkV5qMkpEn-mUjSP3zlgKuHGRYcdWt4gwKoUMs0fM0gENmC8wCml8LI_-ED2VCExi8c-n0hRpk7If-jofg9hn'
//      })
//     };
//
//     let url = 'https://fcm.googleapis.com/fcm/send';
//     let currentuser = JSON.parse(localStorage.getItem('LUser'));
//
//     let notification = {
//       "notification": {
//         "title": title,
//         "body": msg,
//         "click_action": "FCM_PLUGIN_ACTIVITY",
//         "sound": "default",
//         "icon":"../assets/img/logo"
//       },
//       "data": {
//         "title": title,
//         "message": msg,
//         "caller": currentuser.username,
//         "caller_id":currentuser.telephone
//       },
//         "android":{
//         "ttl":"2419200s"
//       },
//       "to":'/topics/'+topic,
//       "priority": "high"
//     };
//
//     console.log(JSON.stringify(notification));
//
//     this.http.post(url, notification, httpOptions)
//       .subscribe(data => {
//         console.log("notif posté");
//         console.log(data);
//        }, error => {
//         console.log(error);
//         console.log(JSON.stringify(error.json()));
//         // this.showAlertSuccess("notification successfuly sended to "+topic);
//       });
//
//
//   }
