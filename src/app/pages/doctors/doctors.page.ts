import { AlertController } from '@ionic/angular';
import { GeneralService } from './../../providers/general.service';
import { RestapiService } from './../../services/restapi.service';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ElementRef } from '@angular/core';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-doctors',
  templateUrl: './doctors.page.html',
  styleUrls: ['./doctors.page.scss'],
})
export class DoctorsPage implements OnInit {

  searchbar = 1;
  doctors: any = [];
  saveDoctors: any = [];
  specialites: any = [];
  niveaux: any = [];
  evaluations: any = [];
  lastSelected = "-1";
  filterType;
  searchQuery = "";

  constructor(
    public general: GeneralService,
    public rest: RestapiService,
    public router: Router,
    private elementRef: ElementRef,
    public alertController: AlertController,
    public active: ActivatedRoute
  ) { }

  ngOnInit(): void {

    // if (this.general.currentUser != null && this.general.currentUser.niveau_id == 1 && this.general.currentUser.prix == null) {
    //   this.general.presentToasTop("Vous n'avez pas fixé le prix de vos consultations. Vous ne pourrez pas recevoir de demande de consultation si vous ne le faites pas");
    // }

    // this.loadNiveaux();
  }

  setStyle(i, spe): void {
    console.log("setting style to " + i);
    console.log("specialité: " + spe);
    if (this.lastSelected != i) {
      try {
        document.getElementById(i).classList.add('active');
        document.getElementById(this.lastSelected).classList.remove('active');
        this.lastSelected = i;
      } catch (error) {

      }
    }

    let docteurs = this.saveDoctors;
    let docs = [];
    if (spe.toLowerCase() == "all") {
      this.doctors = this.saveDoctors;
      console.log("all");
      console.log(this.doctors);
    }
    else {
      docteurs.forEach((elt, i) => {
        if (elt.specialite.toLowerCase() == spe.toLowerCase()) {
          docs.push(elt);
        }
      });
      console.log(docteurs);
      this.doctors = docs;
    }
  }

  ionViewWillEnter() {

    this.loadNiveaux();

  }



  // ionViewDidEnter(){
  // }

  toggleSearchBar() {
    if (this.searchbar == 0) {
      this.searchbar = 1;
    }
    else {
      this.searchbar = 0;
    }
    this.searchQuery = "";
  }


  async doRefresh(event) {
    this.filterType = null;
    this.ionViewWillEnter();
    event.target.complete();
  }

  async loadDoctors() {
    // this.general.showLoader("Chargement...");
    this.rest.getUsersPerType(1).subscribe((data) => {
      this.doctors = data;
      this.doctors.forEach((elt, index) => {
        let eva: any;
        console.log(this.evaluations);
        eva = this.general.getNotePerMedecin(elt.id, this.evaluations);
        console.log(eva);
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
        elt.note = eva.total;
        elt.nbVote = eva.vote;
        console.log(elt);
      });
      console.log(this.doctors);
      this.saveDoctors = this.doctors;

      if (this.general.filter != null) {
        console.log(this.specialites);
        let spe = this.general.filter.toLowerCase();
        if (spe.length > 0) {
          this.filterType = 3;
          let i = 0;
          let r = 1;
          do {
            console.log(spe + " == " + this.specialites[i].nom.toLowerCase());
            if (this.specialites[i].nom.toLowerCase() == spe) {
              this.lastSelected = "-1";
              this.setStyle("" + i, spe);
            }
            i++;
          }
          while (r == 1 && i < this.specialites.length);
        }
      }
      else {
        console.log("ohne param");
        this.filterType = null;
      }

      this.general.stopLoader();
    },
      (error) => {
        this.general.showAlertError("Impossible de charger les données ");
        this.general.stopLoader();
      });
  }


  goDoctor(item) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        data: JSON.stringify(item)
      }
    };

    this.router.navigate(['doctor'], navigationExtras);
  }

  loadSpecialites() {
    // this.general.showLoader("Chargement...");
    this.rest.getAllSpecialites().subscribe((res) => {
      console.log(res);
      this.specialites = res;
      // this.general.stopLoader();
      this.getAllEvaluations();

    },
      (error) => {
        this.general.showAlertError("Une erreur est survenue pendant le chargement. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });
  }

  getAllEvaluations() {
    // this.general.showLoader("Chargement...");
    this.rest.getAllEvaluations().subscribe((res) => {
      console.log(res);
      this.evaluations = res;
      // this.general.stopLoader();
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

  async presentAlertRadio() {
    const alert = await this.alertController.create({
      cssClass: 'my-class5',
      message: "filtrer la liste par",
      // header: 'Radio',
      inputs: [
        {
          name: '1',
          type: 'radio',
          label: 'Nom',
          value: '1',
          handler: () => {


          }
        },
        {
          name: '2',
          type: 'radio',
          label: 'Notes',
          value: '2',
          handler: () => {


          }
        },
        {
          name: '3',
          type: 'radio',
          label: 'Specialité',
          value: '3',
          handler: () => {


          }
        },

        {
          name: '4',
          type: 'radio',
          label: 'Expérience',
          value: '4',
          handler: () => {


          }
        },

        {
          name: '5',
          type: 'radio',
          label: 'Date',
          value: '5',
          handler: () => {


          }
        }
      ],
      buttons: [
        {
          text: 'Annuler',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            this.doctors = this.saveDoctors;
          }
        }, {
          text: 'filtrer',
          handler: (data) => {
            console.log(data);
            this.filtrerListe(data);
          }
        }
      ]
    });

    await alert.present();
  }

  filtrerListe(index) {
    if (index == 3) {
      this.filterType = 3;
      this.doctors = this.saveDoctors;
    }
    else {
      this.filterType = null;
    }

    let docteurs = this.saveDoctors;
    if (index == 1) {
      docteurs.forEach((elt, i) => {
        for (let index = i + 1; index < docteurs.length; index++) {
          const element = docteurs[index];
          if (element.prenom.toLowerCase().charAt(0) < elt.prenom.toLowerCase().charAt(0)) {
            docteurs[i] = element;
            docteurs[index] = elt;
          }
        }
      });
      console.log(docteurs);
      this.doctors = docteurs;
    }
    if (index == 2) {
      docteurs.forEach((elt, i) => {
        for (let index = i + 1; index < docteurs.length; index++) {
          const element = docteurs[index];
          if (element.note >= elt.note) {
            docteurs[i] = element;
            docteurs[index] = elt;
          }
        }
      });
      console.log(docteurs);
      this.doctors = docteurs;
    }
    if (index == 4) {
      docteurs.forEach((elt, i) => {
        for (let index = i + 1; index < docteurs.length; index++) {
          const element = docteurs[index];
          if (element.experience >= elt.experience) {
            docteurs[i] = element;
            docteurs[index] = elt;
          }
        }
      });
      console.log(docteurs);
      this.doctors = docteurs;
    }
    if (index == 5) {
      docteurs.forEach((elt, i) => {
        for (let index = i + 1; index < docteurs.length; index++) {
          const element = docteurs[index];
          if (new Date(element.date) > new Date(elt.experience)) {
            docteurs[i] = element;
            docteurs[index] = elt;
          }
        }
      });
      console.log(docteurs);
      this.doctors = docteurs;
    }

  }

  search(ev) {
    console.log(ev.target.value);
    let docs = [];
    if (this.searchQuery.length > 0) {
      this.saveDoctors.forEach(elt => {
        let nom = elt.nom.toLowerCase();
        let pnom = elt.prenom.toLowerCase();
        if (nom.includes(this.searchQuery.toLowerCase()) || pnom.includes(this.searchQuery.toLowerCase())) {
          docs.push(elt);
        }
      });
      this.doctors = docs;
    }
    else {
      this.doctors = this.saveDoctors;
    }


  }

}
