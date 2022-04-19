import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { IncomingPageRoutingModule } from './incoming-routing.module';

import { IncomingPage } from './incoming.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IncomingPageRoutingModule
  ],
  declarations: [IncomingPage]
})
export class IncomingPageModule {}
