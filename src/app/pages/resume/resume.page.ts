import { RestapiService } from './../../services/restapi.service';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from './../../providers/general.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-resume',
  templateUrl: './resume.page.html',
  styleUrls: ['./resume.page.scss'],
})
export class ResumePage implements OnInit {
  resume = "";
  ordonance = "";
  carnetItem: any;
  numero = "";
  patient = null;
  patient_username = "";
  currentResume: any = null
  constructor(
    public general: GeneralService,
    public active: ActivatedRoute,
    public rest: RestapiService
  ) {

  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.active.queryParams.subscribe(params => {
      if (params && params.data) {
        let d = JSON.parse(params.data);
        console.log(d);
        this.numero = d.numero;
        this.patient = d.user_id;
        this.patient_username = d.username_patient;
        this.getResume(this.numero);
      }
    });
  }

  saveResume() {
    if (this.resume.length > 0) {
      let carnetItem = {
        titre: "",
        description: this.resume,
        demande_id: this.numero,
        ordonance: this.ordonance
      }
      console.log(carnetItem);
      this.general.showLoader("Enregistrement...");
      this.rest.saveCarnetItem(carnetItem).subscribe((data) => {
        console.log(data);
        this.general.showAlertSuccess("Compte rendu de la consultation enregistré avec succès !!!");
        let msg = this.general.currentUser.prenom + " " + this.general.currentUser.nom + " a ajouté le compte rendu de la consultation dans votre carnet";
        this.general.sendPush("LOSTO", msg, null, this.patient_username);
        this.general.stopLoader();
      },
        (error) => {
          console.log(error);
          this.general.showAlertError("Impossible d'enregistrer le compte rendu");
          this.general.stopLoader();
        });
    }
    else {
      this.general.showAlertError("Veuillez saisir le compte rendu");
    }
  }

  updateResume() {
    if (this.resume.length > 0) {
      let carnetItem = {
        titre: "",
        description: this.resume,
        ordonance: this.ordonance
      }
      console.log(carnetItem);
      console.log(this.currentResume.id);
      this.general.showLoader("Enregistrement...");
      this.rest.updateCarnetItem(this.currentResume.id, carnetItem).subscribe((data) => {
        this.currentResume.description = this.resume;
        console.log(data);
        this.general.showAlertSuccess("Compte rendu de la consultation mis à jour avec succès !!!");
        let msg = this.general.currentUser.prenom + " " + this.general.currentUser.nom + " a modifié le compte rendu de la consultation dans votre carnet";
        this.general.sendPush("LOSTO", msg, null, this.patient_username);
        this.general.stopLoader();
      },
        (error) => {
          console.log(error);
          this.general.showAlertError("Impossible de mettre le compte rendu à jour");
          this.general.stopLoader();
        });
    }
    else {
      this.general.showAlertError("Veuillez saisir le compte rendu");
    }
  }

  getResume(id) {

    this.general.showLoader("Chargement...");
    this.rest.getCarnetItemsPerDemandeID(id).subscribe((data) => {
      console.log(data);
      this.currentResume = data[0];
      if (this.currentResume != null) {
        this.resume = this.currentResume.description;
        this.ordonance = this.currentResume.ordonance;
      }
      console.log(data);
      this.general.stopLoader();
    },
      (error) => {
        console.log(error);
        this.general.showAlertError("Impossible d'enregistrer le compte rendu");
        this.general.stopLoader();
      });
  }
}
