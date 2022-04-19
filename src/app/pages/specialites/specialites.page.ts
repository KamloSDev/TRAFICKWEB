import { GeneralService } from './../../providers/general.service';
import { RestapiService } from './../../services/restapi.service';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { PopoverController, AlertController } from '@ionic/angular';


@Component({
  selector: 'app-specialites',
  templateUrl: './specialites.page.html',
  styleUrls: ['./specialites.page.scss'],
})
export class SpecialitesPage implements OnInit {

  searchbar = 1;
  specialites: any = [];
  saveSpecialites: any = [];
  searchQuery = "";

  constructor(
    public popoverCtrl: PopoverController,
    public general: GeneralService,
    public rest: RestapiService,
    public router: Router,
    public alertController: AlertController
  ) { }

  ngOnInit() {
  }

  async doRefresh(event) {
    this.ionViewWillEnter();
    event.target.complete();
  }
  toggleSearchBar() {
    this.searchQuery = "";
    this.specialites = this.saveSpecialites;
    if (this.searchbar == 0) {
      this.searchbar = 1;
    }
    else {
      this.searchbar = 0;
    }
    this.specialites = this.saveSpecialites;
  }

  search(ev) {
    console.log(ev.target.value);
    let docs = [];
    if (this.searchQuery.length > 0) {
      this.saveSpecialites.forEach(elt => {
        let nom = elt.nom.toLowerCase();
        if (nom.includes(this.searchQuery.toLowerCase())) {
          docs.push(elt);
        }
      });
      this.specialites = docs;
    }
    else {
      this.specialites = this.saveSpecialites;
    }
  }

  ionViewWillEnter() {
    console.log(" specialités enterred");
    this.loadSpecialites();
  }

  loadSpecialites() {
    this.general.showLoader("Chargement...");
    this.rest.getAllSpecialites().subscribe((res) => {
      console.log(res);
      this.specialites = res;
      this.saveSpecialites = this.specialites;
      this.general.stopLoader();
    },
      (error) => {
        this.general.showAlertError("Une erreur est survenue pendant le chargement. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });
  }
}
