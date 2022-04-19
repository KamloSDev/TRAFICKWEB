import { GeneralService } from './../../providers/general.service';
import { RestapiService } from './../../services/restapi.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-recouvrement',
  templateUrl: './recouvrement.page.html',
  styleUrls: ['../login/login.page.scss'],
})
export class RecouvrementPage implements OnInit {

  username: string = "";
  telephone: number;
  pass1: string = "";
  pass2: string = "";

  constructor(
    public rest: RestapiService,
    public general: GeneralService
  ) { }

  ngOnInit() {
  }
  checkUser() {
    let phone = "" + this.telephone;

    if (this.username.length > 0 && phone.length == 9 && phone.charAt(0) == '6' && this.pass1.length > 0 && this.pass1 == this.pass2) {
      this.general.showLoader("Un instant...");
      this.rest.getUserPerUsername(this.username).subscribe((data) => {
        console.log(data);
        if (data[0] != null && data[0].telephone == phone) {
          console.log("user found. we should update");
          let user = data[0];
          user.password = this.pass1;
          this.rest.updateUser(user).subscribe((res) => {
            window.localStorage.setItem("user", JSON.stringify(user));
            this.username = "";
            this.telephone = null;
            this.pass1 = "";
            this.pass2 = "";
            phone = "";
            this.general.showAlertSuccess("Mot de passe réinitialisé avec succès !!!");
            this.general.stopLoader();
          },
            (error) => {
              this.general.showAlertError("Impossible d'enregistrer le nouveau mot de passe. vérifiez votre connexion internet, puis réessayez");
              this.general.stopLoader();
            });
        }
        else {
          this.general.showAlertError("Le nom d'utilisateur et le numero de telephone que vous avez fournie ne correspondent à ceux d'aucun utilisateur");
          this.general.stopLoader();
        }
      },
        (error) => {
          this.general.showAlertError("Error when checking username: " + error);
          this.general.stopLoader();
        })

    }
    else {
      if (this.username.length == 0 || this.pass1.length == 0 || this.pass2.length == 0 || phone.length == 0) {
        this.general.showAlertError("Veuillez remplir tous les champs");
      }
      else if (phone.length != 9 || phone.charAt(0) != '6') {
        this.general.showAlertError("Numero de telephone incorrect");
      }
      else {
        this.general.showAlertError("les deux mots de passe doivent être identiques");
      }
      this.general.stopLoader();
    }

  }
}
