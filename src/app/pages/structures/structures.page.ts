import { NavController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { GeneralService } from 'src/app/providers/general.service';
import { RestapiService } from 'src/app/services/restapi.service';

@Component({
  selector: 'app-structures',
  templateUrl: './structures.page.html',
  styleUrls: ['../home/home.page.scss'],
})
export class StructuresPage implements OnInit {
  structures: any = [];
  saveStructures: any = [];
  showBar = 1;
  searchText = "";

  constructor(
    public rest: RestapiService,
    public general: GeneralService,
    public router: Router,
    public nav: NavController,
  ) { }

  ngOnInit() {
    if(this.general.currentUser != null ){
      this.getAllStructures();
    }
    else{
      this.router.navigate
      this.nav.navigateRoot("/login");
    }

  }

  async doRefresh(event) {
    this.ngOnInit();
    event.target.complete();
  }

  toggleSearchBar(){
    if(this.showBar === 0) {
      this.showBar = 1;
      this.structures = this.saveStructures;
    }
    else {
      this.showBar = 0;
    }
    this.searchText = "";
  }

  async getAllStructures(){
    this.general.showLoader("Chargement...");
    let temp = [];
      this.structures = await this.rest.getAllStructures();
      await this.structures.forEach((elt) =>{
          if(elt.statut == 0) {
            temp.push(elt);
          }
      });
    this.structures = temp;
    this.general.stopLoader();

  }

  searchStructure(){

    let text = this.searchText.toLocaleLowerCase();
    this.structures = [];
    if(this.searchText.length > 0) {
      this.structures = this.saveStructures.filter(function (elt) {
        return elt.nom.toLowerCase().includes(text)
      });
      console.log(this.structures);
    } else {
      this.structures = this.saveStructures;
    }
  }

  goStructure(item) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        structure: JSON.stringify(item)
      }
    };

    this.router.navigate(['structure'], navigationExtras);
  }

}
