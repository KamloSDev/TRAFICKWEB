import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Point } from './../../models/point.model';
import { GeneralService } from './../../providers/general.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder, NativeGeocoderResult, NativeGeocoderOptions } from '@ionic-native/native-geocoder/ngx';
import { ModalController } from '@ionic/angular';

// import {
//   GoogleMaps,
//   GoogleMap,
//   GoogleMapsEvent,
//   GoogleMapOptions,
//   CameraPosition,
//   MarkerOptions,
//   Marker
//  } from '@ionic-native/google-maps/ngx';

declare var google: any;

@Component({
  selector: 'app-map',
  templateUrl: './map.page.html',
  styleUrls: ['./map.page.scss'],
})
export class MapPage implements OnInit {

  @ViewChild('map', { static: true }) mapRef: ElementRef;
  map: any;
  points = [];
  movedPoints = [];
  location: any = {
    lat: 3.887325,
    lng: 11.549694
  };
  structure = null;
  directionsService: any;
  directionsRenderer: any;
  placesService: any;
  infowindow: any;
  infowindowContent: HTMLElement;
  mode = 1; //1 for readonly and 0 for edit mode

  constructor(
    private modalCtrl: ModalController,
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    public general: GeneralService,
    public statusBar: StatusBar
  ) {

  }
  ionViewDidLeave(){
    this.statusBar.show();
   }
  ngOnInit() {
    this.statusBar.hide();
    this.chargerMap();
    this.structure = this.general.structureForMapMarker;
    if(this.structure != null){
      localStorage.removeItem('removedMapPoints');
      console.log(this.structure);
    }

    if(this.general.currentReadingStructure != null ) {

      this.points = this.general.structureReadPoints;
      this.points.forEach(elt => {
          let latLng = new google.maps.LatLng(elt.latitude, elt.longitude);
          this.placeReadOnlyMarker(latLng, this.map);
      });
    }

  }

  chargerMap(): void {

    this.map = new google.maps.Map(
      document.getElementById("map") as HTMLElement,
      {
        zoom: 15,
        center: this.location,
        mapTypeId: google.maps.MapTypeId.ROADMAP
      }
    );

    if(this.general.currentReadingStructure != null) {
        this.mode = 1;
    } else {
        this.mode = 0;
        this.initEvents(this.map, this.location);
    }

  }

  initEvents(map, origin) {
    this.location = origin;
    this.directionsService = new google.maps.DirectionsService();
    this.directionsRenderer = new google.maps.DirectionsRenderer();
    this.directionsRenderer.setMap(map);
    this.placesService = new google.maps.places.PlacesService(this.map);
    this.infowindow = new google.maps.InfoWindow();
    this.infowindowContent = document.getElementById(
      "infowindow-content"
    ) as HTMLElement;
    this.infowindow.setContent(this.infowindowContent);

    this.map.addListener("click", this.handleClick.bind(this));

  }

  isIconMouseEvent(
    e: google.maps.MapMouseEvent | google.maps.IconMouseEvent
  ): e is google.maps.IconMouseEvent {
    return "placeId" in e;
  }

  handleClick(event: google.maps.MapMouseEvent | google.maps.IconMouseEvent) {

    console.log("You clicked on: " + event.latLng);
    console.log(event.latLng[0]);
    this.placeMarkerAndPanTo(event.latLng, this.map);
    // If the event has a placeId, use it.
    if (this.isIconMouseEvent(event)) {
      console.log("You clicked on place:" + event.placeId);
      event.stop();

      if (event.placeId) {
        // this.calcRoute(event.placeId);
        // this.getPlaceInformation(event.placeId);
        // alert("uncomment");
      }
    }
  }

  placeReadOnlyMarker(latLng, map) {

    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    // faire sautiller les markers
    marker.setAnimation(google.maps.Animation.BOUNCE);

      let point = new Point(latLng.toJSON().lat, latLng.toJSON().lng);
      this.points.push(point);
      const contentString =
        `<div id="content" class="marker_content">
        <div id="siteNotice">
        </div>
        <p id="firstHeading" class="marker_title">${this.general.currentReadingStructure.nom}</p>
        <p class="marker_mail">${this.general.currentReadingStructure.email}</p>
        </div></div>`;

      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
      map.setCenter(marker.getPosition());
      google.maps.event.addListener(infowindow,'closeclick',function(){
        marker.setMap(null);
      });

  }

  placeMarkerAndPanTo(latLng, map) {

    console.log(latLng);
    let marker = new google.maps.Marker({
      position: latLng,
      map: this.map,
      animation: google.maps.Animation.DROP,
    });
    console.log(latLng);
    // faire cette animation lorsqu'il s'agit de la consultation
    // marker.setAnimation(google.maps.Animation.BOUNCE);
      console.log(latLng.toJSON());
    if(this.structure != null){
      let point = new Point(latLng.toJSON().lat, latLng.toJSON().lng);
      this.points.push(point);
      const contentString =
      `<div id="content" class="marker_content">
      <div id="siteNotice">
      </div>
      <p id="firstHeading" class="marker_title">${this.structure.nom}</p>
      <p class="marker_mail">${this.structure.email}</p>
       </div></div>`;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });

      infowindow.open({
        anchor: marker,
        map,
        shouldFocus: false,
      });
      marker.addListener('click', () => {

        if (this.map.zoom <= 15) {
          map.setZoom(18);
          map.setCenter(marker.getPosition());
        }

        infowindow.open({
          anchor: marker,
          map,
          shouldFocus: false,
        });
        map.panTo(latLng);
      });
      console.log(this.points);
      google.maps.event.addListener(infowindow,'closeclick',function(){
        marker.setMap(null); //removes the marker
        console.log(point);
        let removed  = [];
        removed = JSON.parse(localStorage.getItem("removedMapPoints"));
        // console.log("before push");
        // console.log(removed);
        if(removed == undefined) {
          removed = [];
        }
        removed.push(point);
        localStorage.setItem("removedMapPoints",JSON.stringify(removed));
        console.log(removed);
     });
    }
    else{
      this.general.presentToastError("Une erreur est survenue. veuillez fermer, puis reouvrir la carte !!!");
    }

  }

  removePoint(p){
    let index = this.points.indexOf(p);
    this.points.splice(index, 1);
  }

  dismiss(){
    this.general.structureReadPoints = null
    this.general.currentReadingStructure = null;
    this.modalCtrl.dismiss(null);
  }

  selectLocation(){
    console.log(this.points);
    this.modalCtrl.dismiss(this.points);
  }

}
