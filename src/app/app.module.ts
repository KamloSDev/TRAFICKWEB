import { NativeAudio } from '@ionic-native/native-audio/ngx';
import { FCM } from './../../plugins/cordova-plugin-fcm-with-dependecy-updated/src/ionic/ngx/FCM';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { AngularFireModule } from '@angular/fire';
import { AngularFireDatabaseModule } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { environment } from '../environments/environment';
import localeFr from '@angular/common/locales/fr';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeFr);
import {LOCALE_ID} from '@angular/core';
import { Camera } from '@ionic-native/camera/ngx';
import {DpDatePickerModule} from 'ng2-date-picker';
import { AngularFireModule } from '@angular/fire';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { NativeGeocoder } from '@ionic-native/native-geocoder/ngx';

import { NgxPermissionsModule } from 'ngx-permissions';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
// import {NativeAudio} from '@ionic-native/native-audio';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireStorageModule,
    DpDatePickerModule,
    NgxPermissionsModule.forRoot()
  ],
  providers: [
    AndroidPermissions,
    FCM,
    StatusBar,
    Camera,
    FileTransfer,
    InAppBrowser,
    NativeAudio,

    Geolocation,
    NativeGeocoder,

    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {provide: LOCALE_ID, useValue: 'fr-FR' },
    // NativeAudio,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
