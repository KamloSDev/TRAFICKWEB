import { ModalController, NavController } from '@ionic/angular';
import { MapPage } from './../map/map.page';
import { RestapiService } from 'src/app/services/restapi.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { GeneralService } from 'src/app/providers/general.service';

@Component({
  selector: 'app-structure',
  templateUrl: './structure.page.html',
  styleUrls: ['./structure.page.scss'],
})
export class StructurePage implements OnInit {

  segmentModel = 'description';
  structure = null;
  mapPoints: any = [];

  constructor(
    public statusbar: StatusBar,
    public active: ActivatedRoute,
    public general: GeneralService,
    public rest: RestapiService,
    public modalCtrl: ModalController,
    private navCtrl: NavController
  ) {
    this.active.queryParams.subscribe(params => {
      if (params && params.structure) {
        this.structure = JSON.parse(params.structure);
        console.log(this.structure);
        this.rest.getPointsPerStructureID(this.structure.id).subscribe((data) => {
          this.mapPoints = data;
          console.log(data);
        },
        (error)=>{
          console.log(error);
        });

      }
    });
   }

   ionViewDidLeave(){
    this.statusbar.show();
   }
   ionViewWillEnter(){
    this.statusbar.hide();
   }

  ngOnInit() {
    // this.statusbar.hide();
  }
  segmentChanged(ev: any) {
    console.log('Segment changed', ev);
  }

  async openMap() {
    this.general.structureReadPoints = this.mapPoints;
    this.general.currentReadingStructure = this.structure;
    let modal = await this.modalCtrl.create({
      component: MapPage
    });

    await modal.present();

    let res = await modal.onDidDismiss();

    // if (res.data) {
    //   console.log(res.data);
    //   this.mapPoints = res.data;
    // }
    // else {
    //   this.mapPoints = [];
    //   console.log(this.mapPoints);
    // }
  }

  goBack(){
    console.log("going back...");
    this.navCtrl.back();
  }

}
