import { InAppBrowser, InAppBrowserOptions } from '@ionic-native/in-app-browser/ngx';
import { GeneralService } from './../../providers/general.service';
import { ActivatedRoute } from '@angular/router';
import { RestapiService } from './../../services/restapi.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-carnet',
  templateUrl: './carnet.page.html',
  styleUrls: ['./carnet.page.scss'],
})
export class CarnetPage implements OnInit {

  carnetItems: any = [];
  doctors: any = [];
  specialites: any = [];
  niveaux: any = [];

  constructor(
    public general: GeneralService,
    public active: ActivatedRoute,
    public rest: RestapiService,
    private iab: InAppBrowser
  ) { }

  ngOnInit() {
  }


  ionViewWillEnter() {
    console.log(this.general.currentUser);
    this.active.queryParams.subscribe(params => {
      if (params && params.user_id) {
        let user_id = JSON.parse(params.user_id);
        this.getCarnetItems(user_id);
      } else {
        this.getCarnetItems(this.general.currentUser.id);
      }
    });

    this.loadNiveaux();

    // this.loadSpecialites();
    // this.loadDoctors();
  }

  getCarnetItems(id) {

    this.general.showLoader("Chargement...");
    this.rest.getCarnetUserPerPatientId(id).subscribe((data) => {
      this.carnetItems = data;
      console.log(data);
      this.general.stopLoader();
    },
      (error) => {
        console.log(error);
        this.general.showAlertError("Impossible de charger les éléments de votre carnet");
        this.general.stopLoader();
      });
  }

  async loadDoctors() {
    // this.general.showLoader("Chargement...");
    this.rest.getUsersPerType(1).subscribe((data) => {
      this.doctors = data;
      this.doctors.forEach((elt, index) => {

        if (elt.specialite_id != null && elt.specialite_id != 0) {
          console.log(elt.specialite_id);
          console.log(this.specialites);
          console.log(this.general.getArrayItemPerId(elt.specialite_id, this.specialites));
          elt.specialite = this.general.getArrayItemPerId(elt.specialite_id, this.specialites).nom;
        }
        else {
          elt.specialite = this.general.getArrayItemPerId(elt.niveau_id, this.niveaux).nom;
          // console.log(elt.specialite);
        }
        console.log(elt);
      });
      this.formatCarnetItems();
      console.log(this.doctors);



      this.general.stopLoader();
    },
      (error) => {
        this.general.showAlertError("Impossible de charger les données ");
        this.general.stopLoader();
      });
  }

  loadSpecialites() {
    // this.general.showLoader("Chargement...");
    this.rest.getAllSpecialites().subscribe((res) => {
      console.log(res);
      this.specialites = res;
      this.loadDoctors();

    },
      (error) => {
        this.general.showAlertError("Une erreur est survenue pendant le chargement. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });
  }

  loadNiveaux() {
    this.general.showLoader("Chargement...");
    this.rest.getAllNiveaux().subscribe((res) => {
      console.log(res);
      this.niveaux = res;
      this.loadSpecialites();
    },
      (error) => {
        this.general.showAlertError("Une erreur est survenue pendant le chargement. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });

  }

  formatCarnetItems() {
    console.log(this.doctors);
    this.carnetItems.forEach((e, index) => {
      console.log(e);
      let c: any;
      c = this.checkInDoctorsArray(e.medecin_id);
      console.log(c);
      if (c != null) {
        let doc;
        doc = c.prenom + " " + c.nom;
        let elt = {
          date: e.date,
          date_resume: e.date_resume,
          ordonance: e.ordonance,
          resume: e.resume,
          docteur: doc,
          specialite: c.specialite,
        }
        this.carnetItems[index] = elt;
      }

    });
    console.log(this.carnetItems);
  }

  checkInDoctorsArray(id) {
    let r = null;
    let i = 0;
    do {
      let elt = this.doctors[i];
      if (elt.id == id) {
        r = elt;
      }
      i++;
    }
    while (r == null && i < this.doctors.length);
    return r;
  }

printCarnet(){
  if(this.carnetItems.length>0){
    //   let options : InAppBrowserOptions = {
    //     location : 'yes',//Or 'no'
    //     hidden : 'no', //Or  'yes'
    //     clearcache : 'yes',
    //     clearsessioncache : 'yes',
    //     zoom : 'yes',//Android only ,shows browser zoom controls
    //     hardwareback : 'yes',
    //     mediaPlaybackRequiresUserAction : 'no',
    //     shouldPauseOnSuspend : 'no', //Android only
    //     closebuttoncaption : 'Close', //iOS only
    //     disallowoverscroll : 'no', //iOS only
    //     toolbar : 'yes', //iOS only
    //     enableViewportScale : 'no', //iOS only
    //     allowInlineMediaPlayback : 'no',//iOS only
    //     presentationstyle : 'pagesheet',//iOS only
    //     fullscreen : 'yes',//Windows only
    // // };
    //   let data = JSON.stringify(this.carnetItems);
    //   const browser = this.iab.create('https://api.lostoweb.com/pdf?user='+this.general.currentUser.id, '_blank', options);
      // const browser = this.iab.create('http://google.com', '_blank');
      window.open('https://api.lostoweb.com/pdf?user='+this.general.currentUser.id, '_system');
    }
  else{
    this.general.showAlert("Votre carnet est vide");
  }
}

}
