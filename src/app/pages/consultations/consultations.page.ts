import { GeneralService } from './../../providers/general.service';
import { RestapiService } from './../../services/restapi.service';
import { Router, NavigationExtras } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';

@Component({
  selector: 'app-consultations',
  templateUrl: './consultations.page.html',
  styleUrls: ['./consultations.page.scss'],
})
export class ConsultationsPage implements OnInit {

  demandes: any = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public general: GeneralService,
    public rest: RestapiService,
    public router: Router,
  ) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    this.getDemandesPerPatient();
  }

  getDemandesPerPatient() {
    this.general.showLoader("Chargement...");
    this.rest.getDemandesPerPatient(this.general.currentUser.id).subscribe((data) => {
      this.demandes = data;

      console.log(data);

      this.general.stopLoader();
    },
      (error) => {
        console.log(error);
        this.general.stopLoader();
      });
  }

  goProfil(item) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        user: JSON.stringify(item)
      }
    };

    this.router.navigate(['/profil'], navigationExtras);
    // this.general.showAlert("Pas encore disponible");
  }


  deleteDemande(id, username) {
    this.general.showLoader("Patientez...");
    this.rest.deleteDemande(id).subscribe((data) => {
      let asker = this.general.currentUser.prenom + " " + this.general.currentUser.nom;
      let msg = asker + " a annulé sa demande de consultation ";
      this.general.sendPush("LOSTO", msg, null, username);
      this.general.stopLoader();
      this.general.presentToasTop("Demande de consultation annulée !!!");
      this.ionViewWillEnter();
    },
      (error) => {
        console.log(error);
        this.general.presentToasTop("Impossible d'annuler votre demande. Réessayez plus tard");
        this.general.stopLoader();
      });
  }
}
