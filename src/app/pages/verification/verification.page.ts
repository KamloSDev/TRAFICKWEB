import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-verification',
  templateUrl: './verification.page.html',
  styleUrls: ['../phone/phone.page.scss'],
})
export class VerificationPage implements OnInit {

  constructor(public statusbar : StatusBar) {
    this.statusbar.backgroundColorByHexString('#00B3B7');
  }

  ngOnInit() {
  }

}
