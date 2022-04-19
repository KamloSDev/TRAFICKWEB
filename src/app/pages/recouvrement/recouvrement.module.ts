import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecouvrementPageRoutingModule } from './recouvrement-routing.module';

import { RecouvrementPage } from './recouvrement.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RecouvrementPageRoutingModule
  ],
  declarations: [RecouvrementPage]
})
export class RecouvrementPageModule {}
