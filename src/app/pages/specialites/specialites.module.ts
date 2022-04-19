import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SpecialitesPageRoutingModule } from './specialites-routing.module';

import { SpecialitesPage } from './specialites.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SpecialitesPageRoutingModule
  ],
  declarations: [SpecialitesPage]
})
export class SpecialitesPageModule {}
