import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MapPage } from './../map/map.page';
import { FCM } from './../../../../plugins/cordova-plugin-fcm-with-dependecy-updated/src/ionic/ngx/FCM';
import { RestapiService } from './../../services/restapi.service';
import { GeneralService } from './../../providers/general.service';
import { Component, OnInit} from '@angular/core';
import { MenuController, ModalController, NavController, Platform } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { NativeAudio } from '@ionic-native/native-audio/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  doctors: any = [];
  specialites: any = [];
  niveaux: any = [];
  evaluations: any = [];
  saveDoctors: any = [];
  searchQuery = "";
  structures: any = [];

  constructor(
    public menuCtrl: MenuController,
    public general: GeneralService,
    public rest: RestapiService,
    public router: Router,
    public fcm: FCM,
    public navCtrl: NavController,
    public modalCtrl: ModalController,
    public statusBar: StatusBar,
    public platform: Platform,
    public nativeAudio: NativeAudio
  ) {
    this.menuCtrl.swipeGesture(true);
    if (this.general.currentUser != null && (this.general.currentUser.niveau_id == null || this.general.currentUser.prix == null)) {
      this.general.presentToasTop("Veuillez compléter votre profil afin d'être visible dans la liste des docteurs");
    }
    try {
      console.log(this.general.currentUser);
      this.fcm.subscribeToTopic(this.general.currentUser.username);
      this.fcm.subscribeToTopic(this.general.currentUser.telephone);
      this.general.presentToastSuccess('subscribed to topic '+this.general.currentUser.telephone);
      // à retirer dans la version finale
      this.fcm.subscribeToTopic("dev");
      this.fcm.subscribeToTopic("admin");
      // this.general.showAlertSuccess("successfull subscription to "+this.general.currentUser.username);
    } catch (error) {
      console.log(error);
      // this.general.showAlertError(error);
    }

  }

  ionViewWillEnter() {
    this.statusBar.show();
    console.log(" tagb enterred");
    this.general.filter = null;
    if (this.general.currentUser != null && this.general.currentUser.niveau_id == 1 && this.general.currentUser.prix == null) {
      this.general.presentToasTop("Vous n'avez pas fixé le prix de vos consultations. Vous ne pourrez pas recevoir de demande de consultation si vous ne le faites pas");
    }
    this.loadNiveaux();
  }

  ionViewDidLoad() {
     this.platform.ready().then(() => {
        // this.nativeAudio.preloadComplex('trackCallSound', 'assets/audio/track_call.mp3', 1, 1, 0).then(() => {
        // });
        // this.nativeAudio.preloadComplex('callSound', 'assets/audio/track_call.mp3', 1, 1, 0).then(() => {
        //   console.log("callSound registered");
        // });
        // this.nativeAudio.preloadComplex('incomingSound', 'assets/audio/incoming.mp3', 1, 1, 0).then(() => {
        //   console.log("incomingSound registered");
        // });
     });
   }

  ngOnInit() {
    this.getAllStructures();
  }

  async doRefresh(event) {
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
      this.general.stopLoader();
    },
      (error) => {
        this.general.showAlertError("Impossible de charger les données ");
        this.general.stopLoader();
      });
  }

  goDoctor(item) {
    // this.general.showLoader("Un instant...");
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
        this.general.showAlertError("Une erreur est survenue pendant le chargement. Vérifiez votre connexion internet, puis réessayez");
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
        this.general.showAlertError("Une erreur est survenue pendant le chargement. Vérifiez votre connexion internet, puis réessayez");
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

  goDocteurs(sp) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        specialite: JSON.stringify(sp)
      }
    };

    this.router.navigate(['/tab-nav/doctors'], navigationExtras);
    // this.general.showAlert("Pas encore disponible");
  }

  async getAllStructures(){
    let temp = [];
      this.structures = await this.rest.getAllStructures();
      await this.structures.forEach((elt) =>{
          if(elt.statut == 0) {
            temp.push(elt);
          }
      });
    this.structures = temp;
  }

  goStructure(item) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        structure: JSON.stringify(item)
      }
    };

    this.router.navigate(['/structure'], navigationExtras);
  }
}
