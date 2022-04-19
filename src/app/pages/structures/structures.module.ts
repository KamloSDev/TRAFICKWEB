import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StructuresPageRoutingModule } from './structures-routing.module';

import { StructuresPage } from './structures.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StructuresPageRoutingModule
  ],
  declarations: [StructuresPage]
})
export class StructuresPageModule {}
