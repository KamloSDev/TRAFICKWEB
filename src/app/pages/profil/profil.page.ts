import { Camera } from '@ionic-native/camera/ngx';
import { RestapiService } from './../../services/restapi.service';
import { User } from '../../models/User.Model';
import { MenuController, NavController, AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from './../../providers/general.service';
import { Component, OnInit } from '@angular/core';
import { format } from "date-fns";

@Component({
  selector: 'app-profil',
  templateUrl: './profil.page.html',
  styleUrls: ['./profil.page.scss'],
})
export class ProfilPage implements OnInit {

  user: any;
  niveau_id: number;
  nom: string;
  prenom: string;
  username: string;
  telephone: string;
  email: string;
  sexe: string;
  date_naissance: any;
  groupe_sanguin: string;
  statut: number;
  prix: number;
  avatar: string;
  password: string;
  // specialite: string;
  specialite_id: number;
  categorie: number = 0;
  niveau: number;
  type: number;
  today: any;
  full_niveau: string = "Choisissez";
  full_categorie: string;
  full_specialite: string = "Choisissez";
  niveaux: any = [];
  specialites: any = [];
  base64Image: any;
  about: string;
  experience;
  view = 0;
  avatarHasChange: boolean = false;

  constructor(
    public general: GeneralService,
    public route: Router,
    public rest: RestapiService,
    public menuCtrl: MenuController,
    public alertController: AlertController,
    public camera: Camera,
    public active: ActivatedRoute,
    public nav: NavController
  ) { }

  ngOnInit() {
    console.log("view enter");
    this.menuCtrl.swipeGesture(true);
    this.today = format(new Date(), "yyyy-MM-dd");
    console.log(this.today);

    this.active.queryParams.subscribe(params => {
      if (params && params.user) {
        this.view = 1;
        let usname = JSON.parse(params.user);
        console.log("received: " + usname);
        this.rest.getUserPerUsername(usname).subscribe((data) => {
          console.log(data);
          this.user = data[0];

          this.initialiseVars();
          this.general.stopLoader();
        },
          (error) => {
            this.general.showAlertError("Error when checking username: " + error);
            this.general.stopLoader();
          });

        console.log(this.user);
      }
      else {
        if (this.general.currentUser != null) {
          this.user = this.general.currentUser;
          this.view = 0;
          this.initialiseVars();

          // this.niveau = 1;


          this.loadNiveaux();
          this.loadSpecialites();
        }
        else {
          this.nav.navigateRoot('login');
        }
      }
    });

  }

  initialiseVars() {

    this.nom = this.user.nom;
    this.prenom = this.user.prenom;
    this.telephone = this.user.telephone;
    this.email = this.user.email;
    this.sexe = this.user.sexe;
    this.date_naissance = this.user.date_naissance;
    this.groupe_sanguin = this.user.groupe_sanguin;
    this.statut = this.user.statut;
    this.prix = this.user.prix;
    this.avatar = this.user.avatar;
    this.password = this.user.password;
    // this.specialite = this.user.specialite;
    this.categorie = this.user.categorie;
    this.niveau = this.user.niveau_id;
    this.username = this.user.username;
    this.type = this.user.type;
    this.about = this.user.about;
    this.experience = this.user.experience;

    if (this.categorie == 0) {
      this.full_categorie = "Generalist(e)";
    }
    if (this.categorie == 1) {
      this.full_categorie = "Specialiste";
    }
  }

  control() {

    if (this.nom != this.user.nom || this.prenom != this.user.prenom || this.email != this.user.email || this.telephone != this.user.telephone ||
      this.username != this.user.username || this.about != this.user.about ||
      this.sexe != this.user.sexe || this.groupe_sanguin != this.user.groupe_sanguin || this.prix != this.user.prix || this.password != this.user.password
      || this.niveau != this.user.niveau || this.date_naissance != this.user.date_naissance || this.avatar != this.user.avatar) {
      // let date = new Date();
      console.log(this.today);
      this.date_naissance = format(new Date(this.date_naissance), "yyyy-MM-dd");;
      if ((this.telephone.length > 0 && this.telephone.length == 9 && this.telephone.charAt(0) == '6')
        && ((this.email == null) || (this.email.length > 0 && this.general.validateEmail(this.email) == true))
        && (this.today > this.date_naissance)
        && (this.sexe.toLowerCase() == 'f' || this.sexe.toLowerCase() == 'm')
        && ((this.groupe_sanguin == null) || (this.groupe_sanguin.toLowerCase() == 'a' || this.groupe_sanguin.toLowerCase() == 'b' || this.groupe_sanguin.toLowerCase() == 'ab' || this.groupe_sanguin.toLowerCase() == 'o'))
      ) {
        // if (this.avatar != this.user.avatar) {
        //   changeAvatar = true;
        // }
        this.general.showLoader("Vérification...");

        if (this.username != this.user.username || this.telephone != this.user.telephone) {

          if (this.username != this.user.username && this.telephone != this.user.telephone) {
            // on va checker le username et le phone
            // on commence par le username
            this.rest.getUserPerUsername(this.username).subscribe((data) => {
              console.log(data);
              if (data[0] == null) {
                //  le username n'est pas utilisé.
                // on check le telephone
                this.rest.getUserPerTelephone(this.telephone).subscribe((res) => {
                  console.log(res);
                  if (res[0] == null) {
                    // le telephone n'est pas encore utilisé
                    this.prepareUpdate(1);
                  }
                  else {
                    this.general.showAlertError("Le numero de telephone " + this.telephone + " est déjà utilisé");
                  }
                  this.general.stopLoader();
                },
                  (error) => {
                    this.general.showAlertError("Error when checking username: " + error);
                    this.general.stopLoader();
                  })
              }
              else {
                this.general.showAlertError("Le nom d'utilisateur " + this.username + " est déjà utilisé");
              }
              this.general.stopLoader();
            },
              (error) => {
                this.general.showAlertError("Error when checking username: " + error);
                this.general.stopLoader();
              })
          }
          else if (this.username != this.user.username) {
            // on check le username
            this.rest.getUserPerUsername(this.username).subscribe((data) => {
              console.log(data);
              if (data[0] == null) {
                this.prepareUpdate(2);
              }
              else {
                this.general.showAlertError("Le nom d'utilisateur " + this.username + " est déjà utilisé");
              }
              this.general.stopLoader();
            },
              (error) => {
                this.general.showAlertError("Error when checking username: " + error);
                this.general.stopLoader();
              })
          }
          else {
            // on check le telephone
            // this.general.showLoader("Checking phone...");
            this.rest.getUserPerTelephone(this.telephone).subscribe((res) => {
              console.log(res);
              if (res[0] == null) {
                this.prepareUpdate(3);
              }
              else {
                this.general.showAlertError("Le numero de telephone " + this.telephone + " est déjà utilisé");
              }
              this.general.stopLoader();
            },
              (error) => {
                this.general.showAlertError("Error when checking username: " + error);
                this.general.stopLoader();
              })
          }
        }
        else {
          // il n'a changé ni le username ni le telephone
          // l'avatar n'a pas changé, on update simplement
          this.prepareUpdate(5);
        }
      }
      else {
        if (this.telephone.length != 9 || this.telephone.charAt(0) != '6') {
          this.general.showAlertError("Numero de telephone incorrect");
        }
        else if (this.email != null && this.general.validateEmail(this.email) == false) {
          this.general.showAlertError("Adresse mail incorrect");
        }
        else if (this.date_naissance >= this.today) {
          this.general.showAlertError("Date de naissance incorrect");
        }
        else if (this.sexe.toLowerCase() != 'f' && this.sexe.toLowerCase() != 'm') {
          this.general.showAlertError("Sexe incorrect. Saisissez M ou F");
        }
        else {
          this.general.showAlertError("Groupe sanguin incorrect");
        }

      }


    }
    else {
      console.log("user have make no change");
    }
  }

  controlDoctorPart() {
    let retour = 1;

    if (this.niveau != 1) {
      this.categorie = null;
      this.specialite_id = null;
      if ((this.prix != null && this.prix <= 0)) {
        this.general.showAlertError("Prix de consultation incorrect");
        // retour = 1;
      }
      else {
        retour = 0;
      }
    }
    else if (this.niveau == 1) {
      retour = 0;
      if (this.categorie == 1) {
        if (this.specialite_id == null) {
          retour = 1;
          this.general.showAlertError("Veuillez préçiser votre spécialité");
        }
      }
      else {
        this.specialite_id = null;
      }
    }

    return retour;
  }

  prepareUpdate(index) {
    console.log("preparing... " + index);

    this.user.nom = this.nom.toLowerCase();
    this.user.prenom = this.prenom.toLowerCase();
    this.user.username = this.username.toLowerCase();
    this.user.telephone = this.telephone;
    this.user.email = this.email;
    this.user.sexe = this.sexe.toLowerCase();
    this.user.date_naissance = this.date_naissance;
    this.user.groupe_sanguin = this.groupe_sanguin;
    this.user.about = this.about;
    this.user.experience = this.experience;
    // this.user.statut = statut;
    this.user.password = this.password;
    // this.user.type = type;

    if (this.type == 1) {
      let cdp = this.controlDoctorPart();
      if (cdp == 0) {
        this.user.prix = this.prix;
        this.user.specialite_id = this.specialite_id;
        this.user.categorie = this.categorie;
        this.user.niveau_id = this.niveau;
        console.log(this.user);
        // this.update();
      }
    }

    // else{
    //   this.update();
    // }
    if (this.avatarHasChange) {
      console.log("we should upload avatar");
      let image_name = "avatar_" + this.user.username;
      this.general.uploadPic(this.base64Image, image_name).then(res => {
        let url = image_name + ".jpg";
        console.log(url);
        this.avatar = url;
        this.user.avatar = url;
        this.update();
      }, error => {
        console.log(error);
        this.general.showAlertError("Impossible d'uploader votre photo de profil. Verifiez votre connexion internet puis réessayez");
      });
    }
    else {
      this.update();
    }
  }


  update() {

    this.general.stopLoader();
    // this.general.showLoader("Mise à jour...");
    // this.user.nom = this.nom.toLowerCase();
    // this.user.prenom = this.prenom.toLowerCase();
    // this.user.username = this.username.toLowerCase();
    // this.user.telephone = this.telephone;
    // this.user.email = this.email;
    // this.user.sexe = this.sexe.toLowerCase();
    // this.user.date_naissance = this.date_naissance;
    // this.user.groupe_sanguin = this.groupe_sanguin;
    // this.user.password = this.password;

    if (this.user.categorie == null) {
      this.user.categorie = 0;
    }

    console.log(this.user);
    this.rest.updateUser(this.user).subscribe((res) => {
      window.localStorage.setItem("LUser", JSON.stringify(this.user));
      this.general.showAlertSuccess("Votre profil a été mis à jour avec succès !!!");
      this.avatarHasChange = false;
      this.general.stopLoader();
    },
      (error) => {
        this.general.showAlertError("Impossible d'enregistrer la mise à jour. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });
  }



  loadNiveaux() {
    this.general.showLoader("Chargement...");
    this.rest.getAllNiveaux().subscribe((res) => {
      console.log(res);
      this.niveaux = res;
      if (this.niveau != null) {
        let n = this.getNiveauPerId(this.niveau);
        console.log(n);
        if (n != null) {
          this.full_niveau = n.nom;
        }
        // alert(this.full_niveau);
      }
      // this.general.stopLoader();
    },
      (error) => {
        this.general.showAlertError("Une erreur est survenue pendant le chargement. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });

  }

  loadSpecialites() {
    // this.general.showLoader("Chargement...");
    this.rest.getAllSpecialites().subscribe((res) => {
      console.log(res);
      this.specialites = res;
      if (this.user.specialite_id != null) {
        let n = this.getSpecialitePerId(this.user.specialite_id);
        console.log(n);
        if (n != null) {
          this.full_specialite = n.nom;
        }
        // alert(this.full_specialite);
      }
      this.general.stopLoader();
    },
      (error) => {
        this.general.showAlertError("Une erreur est survenue pendant le chargement. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });
  }

  getNiveauPerId(id) {
    let res = 1;
    let retour = null;
    let i = 0;
    while (i < this.niveaux.length && res == 1) {
      if (this.niveaux[i].id == id) {
        retour = this.niveaux[i];
        res = 0;
      }
      i++;
    }
    return retour;
  }

  getSpecialitePerId(id) {
    let res = 1;
    let retour = null;
    let i = 0;
    while (i < this.specialites.length && res == 1) {
      if (this.specialites[i].id == id) {
        retour = this.specialites[i];
        res = 0;
      }
      i++;
    }
    return retour;
  }

  AccessGallery() {
    if (this.view == 0) {
      this.camera.getPicture({

        sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,

        destinationType: this.camera.DestinationType.DATA_URL

      }).then((imageData) => {

        this.base64Image = "data:image/jpeg;base64," + imageData;
        this.avatarHasChange = true;
      }, (err) => {

        console.log(err);
        this.general.showAlertError(err);

        // alert(err);
      });
    }

  }


  getUserPerusername(username) {
    this.rest.userInfo(username).subscribe((res) => {
      console.log(res);
      if (res[0] != null) {
        this.user = this.general.currentUser;
        console.log(this.user);
        this.nom = this.user.nom;
        this.prenom = this.user.prenom;
        this.telephone = this.user.telephone;
        this.email = this.user.email;
        this.sexe = this.user.sexe;
        this.date_naissance = this.user.date_naissance;
        this.groupe_sanguin = this.user.groupe_sanguin;
        this.statut = this.user.statut;
        this.prix = this.user.prix;
        this.avatar = this.user.avatar;
        this.password = this.user.password;
        // this.specialite = this.user.specialite;
        this.categorie = this.user.categorie;
        this.niveau = this.user.niveau_id;
        this.username = this.user.username;
        this.type = this.user.type;

      }
      this.general.stopLoader();
    },
      (error) => {
        console.log(error);
        this.general.showAlertError("Une erreur est survenue pendant le chargement. vérifiez votre connexion internet, puis réessayez");
        this.general.stopLoader();
      });
  }

}
