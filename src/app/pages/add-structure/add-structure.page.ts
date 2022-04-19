import { Camera } from '@ionic-native/camera/ngx';
import { Point } from './../../models/point.model';
import { RestapiService } from './../../services/restapi.service';
import { MapPage } from './../map/map.page';
import { ModalController, NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/providers/general.service';
import { Structure } from 'src/app/models/structure.model';
import { Router } from '@angular/router';


@Component({
  selector: 'app-add-structure',
  templateUrl: './add-structure.page.html',
  styleUrls: ['../login/login.page.scss'],
})
export class AddStructurePage implements OnInit {

  part = 1;
  isGeolocated = 1;
  mapPoints = [];

  nom: string = "";
  ville: string = "";
  localisation: string = "";
  telephone1: string = "";
  telephone2: string = "";
  email: string = "";
  url: string = "";
  logo: string = "";
  description: string = "";
  type_id = 0;
  base64Image: any = null;
  logo_url = null;
  structuresCategories = null;

  constructor(
    public modalCtrl: ModalController,
    public rest: RestapiService,
    public general: GeneralService,
    public router: Router,
    public camera: Camera,
    public nav: NavController,
  ) {
    this.part = 1;
  }

  ngOnInit() {
    if(this.general.currentUser != null ){
      this.getStructureCategories();
    }
    else{
      this.nav.navigateRoot("/login");
    }


  }

  getStructureCategories() {
    // this.general.showLoader("Patientez...");
    this.rest.getAllStructureCategories().subscribe((data) => {
      this.structuresCategories = data;
      // this.general.stopLoader();
      console.log(data);
      // this.general.presentToastSuccess("Chargement terminé !!!");
    },
      (error) => {
        console.log(error);
        // this.general.stopLoader();
        this.general.presentToastError("Impossible de charger les categories de structure");
      });
  }

  goNext() {
    // document.getElementById("part2").animate({ right: '0'}, 1000);
    this.part = 2;
  }

  AccessGallery() {

      this.camera.getPicture({
        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
        destinationType: this.camera.DestinationType.DATA_URL
      }).then((imageData) => {
        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.logo_url = this.base64Image;
      }, (err) => {
        console.log(err);
        this.general.showAlertError(err);
      });
  }

  async openMap() {
    let structure = new Structure(this.type_id, this.nom, this.ville, this.localisation, this.telephone1, this.telephone2, this.email, 1, 'logo.png', this.description, this.url);
    if (!(this.url.includes("http://") || this.url.includes("https://") || this.url.includes("http://www.") || this.url.includes("https://www."))) {
      this.url = "http://www." + this.url;
    }
    structure.url = this.url
    this.general.structureForMapMarker = structure;
    let modal = await this.modalCtrl.create({
      component: MapPage
    });
    this.isGeolocated = 0;
    await modal.present();

    let res = await modal.onDidDismiss();

    if (res.data) {
      console.log(res.data);
      this.mapPoints = res.data;
    }
    else {
      this.mapPoints = [];
      console.log(this.mapPoints);
    }
  }

  async uploadStructureLogo(){
      let name = ""+new Date();
      let result = await  this.general.uploadLogoStructure(this.base64Image, name)

          return result;
  }

  async control() {

    let tel1 = "" + this.telephone1;
    let tel2 = "" + this.telephone2;

    if( this.type_id != 0
        && this.nom.length > 0 && this.ville.length > 0 && this.localisation.length > 0
        && (tel1.length == 9 && tel1.charAt(0) == '6') && this.type_id > 0
        && (tel2.length == 0 || (tel2.length == 9 && tel2.charAt(0) == '6'))
        && (this.email.length == 0 || (this.email.length != 0 && this.general.validateEmail(this.email)))
    ) {

      if(this.isGeolocated == 0 && this.mapPoints.length > 0) {
          let removedPoints = JSON.parse(localStorage.getItem("removedMapPoints"));
          this.mapPoints = this.clearMapPoints(this.mapPoints, removedPoints);
          // check si le nom est utilisé par une autre structure
      }
      var format = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
      if(!(format.test(this.nom))) {
        this.general.showLoader("Enregistrement...");
        let structure = await this.rest.getStructurePerName(this.nom);
        if(structure[0] == null ){
            let structure = new Structure(this.type_id, this.nom, this.ville, this.localisation, this.telephone1, this.telephone2, this.email, 1, 'logo.png', this.description, this.url);
            structure.user_id = this.general.currentUser.id;
            if(this.base64Image != null){
                let logoName = await this.uploadStructureLogo();
                if( logoName != -1 ) {
                    structure.logo = logoName;
                    this.logo_url = this.general.STRUCTURES_ROOT+logoName;
                    this.saveStructure(structure);
                } else {
                    this.general.stopLoader();
                    this.general.presentToastError("Impossible d'uploader le logo. Verifiez votre connexion internet puis réessayez");
                }
            }
            else {
              this.saveStructure(structure);
            }
        }
        else{
          this.general.presentToastError(`Le nom ${this.nom} est déjà utilisé !!!`);
        }
      }
      else{
        this.general.presentToastError("Le nom de la structure ne doit pas avoir de caractère special");
      }

      // puis on check le logo et on save

    }
    else {
      if (this.type_id == 0) {
        this.general.presentToastError("Selectionnez la catégorie !!!");
      }
      else if (this.nom.length == 0) {
        this.general.presentToastError("Saisissez le nom !!!");
      }
      else if (this.ville.length == 0) {
        this.general.presentToastError("Saisissez la ville !!!");
      }
      else if (tel1.length != 9 || tel1.charAt(0) != '6') {
        console.log(tel1);

        this.general.presentToastError("Telephone 1 incorrect !!!");
      }
      else if (tel2.length != 0 && (tel2.charAt(0) != '6' || tel2.length != 9)) {
        this.general.presentToastError("Telephone 2 incorrect !!!");
      }
      else if (this.localisation.length == 0) {
        this.general.presentToastError("Saisissez la localisation !!!");
      }
      else {
        this.general.presentToastError("Email incorrect !!!");
      }
    }
  }

  clearMapPoints(mapPoints, removedPoints) {
    let points = mapPoints;
    // console.log(mapPoints);
    if (removedPoints != null && removedPoints.length > 0) {
      for (let i = 0; i < removedPoints.length; i++) {
        let rmElt = removedPoints[i];
        for (let j = 0; j < points.length; j++) {
          let ptElt = points[j];
          if (ptElt.latitude == rmElt.latitude && ptElt.longitude == rmElt.longitude) {
            points.splice(j, 1);
          }
        }
      }
      console.log(points);
      console.log(removedPoints);
    }
    return points;
  }

  goBack() {
    this.router.navigate(['/dashboard']);
  }

  saveStructure(structure) {
    this.rest.saveStructure(structure).subscribe((data) => {
      console.log("structure enregistrée!!!");
      console.log(data);
      if (this.mapPoints.length > 0) {
        console.log("on save les points");
        let save = this.saveMapPoints(data.id);
        if(save){
            this.general.presentToastSuccess("Structure enregistrée !!!");
        }
        else{
            this.general.presentToastError("Impossible d'enregistrer les coordonnés !!! Verifiez votre connexion internet, puis réessayez");
        }
      }
      else {
        this.general.presentToastSuccess("Structure enregistrée !!!");
      }
      this.general.stopLoader();
    },
      (error) => {
        console.log(error);
        this.general.stopLoader();
        this.general.presentToastError("Impossible d'enregistrer votre structure !!! Verifiez votre connexion internet, puis réessayez");
      });
  }

  async saveMapPoints(structure_id) {

      for (var i = 0; i < this.mapPoints.length; i++) {
        let elt = {
          latitude: this.mapPoints[i].latitude,
          longitude: this.mapPoints[i].longitude,
          structure_id: structure_id
        };

        let res = await this.rest.savePoint(elt);
        if(res == -1 )
          return false;
      }
      return true;
    }

}
