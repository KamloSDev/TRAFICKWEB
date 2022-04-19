import { Utilisateur } from './../../models/utilisateur.model';
import { RestapiService } from './../../services/restapi.service';
import { GeneralService } from '../../providers/general.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { FCM } from 'plugins/cordova-plugin-fcm-with-dependecy-updated/src/ionic/ngx/FCM';

@Component({
  selector: 'app-inscription',
  templateUrl: './inscription.page.html',
  styleUrls: ['../login/login.page.scss'],
})
export class InscriptionPage implements OnInit {

  prenom = "";
  nom = "";
  telephone="";
  username = "";
  pass1 = "";
  pass2 = "";
  sexe = "";
  account_type = 0;

  constructor(
    public general: GeneralService,
    public rest: RestapiService,
    public navCtrl: NavController,
    public router: Router,
    public menuCtrl: MenuController,
    public alertController: AlertController,
    public fcm: FCM
  ) {
    this.menuCtrl.swipeGesture(false);
    this.presentAlertRadio();
  }

  ngOnInit() {
  }

  control() {

    if (this.prenom.length > 0 && this.nom.length > 0 && this.username.length > 0 && this.pass1.length > 0 && this.pass2.length > 0 && this.sexe.length > 0) {
      if (this.pass2 == this.pass1) {
        this.general.showLoader("Enregistrement...").then(() => {
          this.username = this.username.toLowerCase();
          console.log(this.username);
          let user = new Utilisateur(this.nom, this.prenom, this.username, this.pass1, this.telephone, this.sexe, 'logo.jpg', null, null, null, 0, this.account_type, null, null, null);
          user.niveau_id = null;
          user.categorie = "0";
          user.specialite_id = null;
          // user.experience = 0;
          // user.avatar = 'logo.jpg';
          this.rest.getUserPerUsername(this.username).subscribe((data) => {
            console.log(data);
            if (data[0] != null) {
              this.general.showAlertError("Le nom d'utilisateur " + user.username + " est déjà utilisé");
              this.general.stopLoader();
            }
            else {
              // on insère l'user
              this.rest.createUser(user).subscribe((data) => {
                console.log(data);
                this.general.sendPush("LOSTO", this.username + " a créé un compte", null, "admin");
                this.nom = "";
                this.prenom = "";
                this.username = "";
                this.pass1 = "";
                this.pass2 = "";
                this.sexe = "";

                this.general.presentToastSuccess("Inscription réussie !!!");
                this.general.stopLoader();
                window.localStorage.setItem("LUser", JSON.stringify(user));

                // on suscrible le num de l'user au push notification
                 console.log("new user phone num: "+user.telephone);
                 this.fcm.subscribeToTopic(user.telephone);

                this.navCtrl.navigateRoot('/login');

              }, (error) => {
                console.log(error);
                this.general.showAlertError("Une erreur est survenue. Veuillez réessayer svp ");
                this.general.stopLoader();
              });
            }

          },
            (error) => {
              console.log(error);
              this.general.showAlertError("Impossible de verifier votre nom d'utilisateur.  Veuillez réessayer svp " + error);
              this.general.stopLoader();
            })
        });
      }
      else {
        this.general.showAlertError("Les 2 mots de passe doivent être identiques");
      }
    }
    else {
      this.general.showAlertError("Veuillez remplir tous les champs");
    }
  }

  goConnexion() {
    this.navCtrl.navigateRoot('/login');
  }


  async presentAlertRadio() {
    const alert = await this.alertController.create({
      cssClass: 'my-class5',
      message: "choisissez le Type de compte",
      // header: 'Radio',
      inputs: [
        {
          name: '1',
          type: 'radio',
          label: 'Patient',
          value: '1',
          handler: () => {
            this.account_type = 0;
          },
          checked: true
        },
        {
          name: '2',
          type: 'radio',
          label: 'Personnel de santé',
          value: '2',
          handler: () => {
            console.log('Personnel  selected');
            this.account_type = 1;
          }
        },
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.navCtrl.navigateRoot("/login");
          }
        }, {
          text: 'suivant',
          handler: () => {
            console.log('Confirm Ok');
          }
        }
      ]
    });

    await alert.present();
  }
}
