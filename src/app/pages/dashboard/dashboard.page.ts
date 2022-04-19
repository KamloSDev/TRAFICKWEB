import { NavigationExtras, Router } from '@angular/router';
import { RestapiService } from './../../services/restapi.service';
import { GeneralService } from './../../providers/general.service';
import { Component, OnInit } from '@angular/core';
import { ActionSheetController, NavController } from '@ionic/angular';
import { format } from "date-fns"

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.page.html',
  styleUrls: ['./dashboard.page.scss'],
})
export class DashboardPage implements OnInit {

  type: string;
  searchbar = 1;
  debut;
  selectedDate;
  JDebut;
  JFin;
  HDebut;
  HFin;
  full_debut = "";
  full_fin = "";
  full_hd = "";
  full_hf = "";
  view = 0;
  planing = null;
  demandes: any = [];
  structures: any = [];

  constructor(
    public actionSheetController: ActionSheetController,
    public general: GeneralService,
    public rest: RestapiService,
    public router: Router,
    public nav: NavController
  ) { }

  ngOnInit() {
  }

  ionViewWillEnter() {
    if(this.general.currentUser != null ) {
      this.type = 'structures';
      this.getUserPlaning();
      if (this.general.currentUser.type == 1) {
        this.getDemandesPerMedecin();
      }
      this.getAllStructures();
    } else {
      this.nav.navigateRoot("/login");
    }
  }

  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  togglesearchbar() {
    if (this.searchbar == 1) {
      this.searchbar = 0;
    }
    else {
      this.searchbar = 1;
    }
  }

  async getAllStructures(){
    console.log("before");
       this.structures = await this.rest.getAllStructures();
       console.log(this.structures);
       console.log("after");
}

async updateStructuteStatus(item, statut){
  item.statut = statut;
  let result  = await this.rest.updateStructuteStatus(item);
  if(JSON.parse(JSON.stringify(result)).id != null){
    if(statut == 0) {
      this.general.presentToastSuccess("Structure validée");
    } else {
      this.general.presentToastSuccess("Structure bloquée");
    }
  }
  else{
    this.general.presentToastError("Une erreur s'est produite. verifiez votre connexion et réessayez");
  }
}

  goCarnet(id) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        user_id: JSON.stringify(id)
      }
    };

    this.router.navigate(['/carnet'], navigationExtras);
  }
  gostructure(item) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        structure: JSON.stringify(item)
      }
    };

    this.router.navigate(['/structure'], navigationExtras);
  }

  goAddStructure(){
    this.router.navigate(['/add-structure']);
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetController.create({
      header: 'Albums',
      cssClass: 'my-custom-class',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          console.log('Delete clicked');
        }
      }, {
        text: 'Share',
        icon: 'share',
        handler: () => {
          console.log('Share clicked');
        }
      }, {
        text: 'Play (open modal)',
        icon: 'caret-forward-circle',
        handler: () => {
          console.log('Play clicked');
        }
      }, {
        text: 'Favorite',
        icon: 'heart',
        handler: () => {
          console.log('Favorite clicked');
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }]
    });
    await actionSheet.present();

    const { role } = await actionSheet.onDidDismiss();
    console.log('onDidDismiss resolved with role', role);
  }

  savePlaning() {
    console.log(this.JDebut);
    console.log(this.JFin);
    console.log(this.HDebut);
    console.log(this.HFin);
    if (this.JDebut != undefined && this.JFin != undefined && this.HDebut != undefined && this.HFin != undefined) {
      if (this.JDebut <= this.JFin) {
        let planing = {
          user_id: this.general.currentUser.id,
          debut: this.JDebut,
          fin: this.JFin,
          heure_debut: format(new Date(this.HDebut), "HH:mm"),
          heure_fin: format(new Date(this.HFin), "HH:mm"),
        }
        console.log(planing);
        this.general.showLoader("Enregistrement...");
        this.rest.savePlaning(planing).subscribe((data) => {
          this.general.showAlertSuccess("Planing enregistré !!!");
          this.planing = planing;
          let msg = "Dr " + this.general.currentUser.prenom + " " + this.general.currentUser.nom + " a mis son planing à jour";
          this.general.sendPush("LOSTO", msg, null, "all");
          this.general.stopLoader()
        },
          (error) => {
            console.log(error);
            this.general.showAlertError("Il y'a eu une erreur pendant l'enregistrement !!!");
            this.general.stopLoader();
          });
      }
      else {
        this.general.showAlertError("Le jour de début ne doit pas être suppérieur au jour de fin !!!");
      }
    }
    else {
      this.general.showAlertError("Veuillez remplir tous les champs");
    }
  }

  getUserPlaning() {
    this.general.showLoader("Chargement...").then(() => {
      this.rest.getPlaningPerUser(this.general.currentUser.id).subscribe((data) => {
        this.planing = data[0];
        if (data[0] != null) {
          this.view = 0;
          this.JDebut = this.planing.debut;
          this.JFin = this.planing.fin;
          this.full_debut = this.general.getDay(this.JDebut);
          this.full_fin = this.general.getDay(this.JFin);
          let hd = this.planing.heure_debut;
          this.full_hd = hd.substr(0, 2) + "h" + hd.substr(2, 3);
          let hf = this.planing.heure_fin;
          this.full_hf = hf.substr(0, 2) + "h" + hf.substr(2, 3);
        }
        else {
          this.view = 1;
        }
        console.log(data);

        this.general.stopLoader();
      },
        (error) => {
          console.log(error);
          this.general.showAlertError("Il y'a eu une erreur pendant le chargement !!!");
          this.general.stopLoader();
        });
    });
  }

  getDemandesPerMedecin() {
    this.rest.getDemandesPerMedecin(this.general.currentUser.id).subscribe((data) => {
      this.demandes = data;
      console.log(data);

      this.general.stopLoader();
    },
      (error) => {
        console.log(error);
        // this.general.showAlertError("Il y'a eu une erreur pendant le chargement !!!");
        this.general.stopLoader();
      });
  }



  // getDemandesAnywhere(){
  //   this.rest.getDemandesAnyWhere(this.general.currentUser.id).subscribe((data) => {
  //     this.demandes = data;
  //     console.log(data);

  //     this.general.stopLoader();
  //   },
  //     (error) => {
  //       console.log(error);
  //       this.general.stopLoader();
  //     });
  // }

  deleteDemande(id, username) {
    this.general.showLoader("Patientez...");
    this.rest.deleteDemande(id).subscribe((data) => {
      let asker = this.general.currentUser.prenom + " " + this.general.currentUser.nom;
      let msg = asker + "  a rejetté votre demande de consultation ";
      this.general.sendPush("LOSTO", msg, null, username);
      this.general.stopLoader();
      this.general.presentToasTop("Demande de consultation rejettée !!!");
      this.ionViewWillEnter();
    },
      (error) => {
        console.log(error);
        this.general.presentToasTop("Impossible de rejetter cette demande. Réessayez plus tard");
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

  updateDemande(statut, item) {
    item.statut = statut;
    this.general.showLoader("Patientez...");
    this.rest.updateDemande(item.id, item).subscribe((data) => {

      if (statut == 1) {
        this.general.showAlertSuccess("Consultation close avec succès. pensez à faire un résumé de cette consultation afin que le carnet du patient soit mis à jour");
        let msg = "Dr " + this.general.currentUser.prenom + " " + this.general.currentUser.nom + " a clos votre consultation. il n'est donc plus possible de la passer";
        this.general.sendPush("LOSTO", msg, null, item.username);
      }
      if(statut == 0) {
        this.general.showAlertSuccess("Consultation reouverte avec succès !!! ");
        let msg = "Dr " + this.general.currentUser.prenom + " " + this.general.currentUser.nom + " a reactivé votre consultation. vous pouvez desormais la passer";
        this.general.sendPush("LOSTO", msg, null, item.username);
      }
      if (statut == 3) {
        this.general.showAlertSuccess("Consultation confirmée. vous serez notifié lorsque le patient fera le paiement");
        let msg = "Dr " + this.general.currentUser.prenom + " " + this.general.currentUser.nom + " a confirmé votre demande. Vous pouvez à présent faire le paiement et commençer la consultation";
        this.general.sendPush("LOSTO", msg, null, item.username);
      }
      this.general.stopLoader();
      this.ionViewWillEnter();
    },
      (error) => {
        console.log(error);
        this.general.stopLoader();
      });
  }

  goResume(item) {
    let ob = {
      numero: item.id,
      medecin_id: item.medecin_id,
      user_id: item.patient_id,
      username_patient: item.username
    };
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(ob)
      }
    };
    this.router.navigate(['/resume'], navigationExtras);
  }

}
