import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { StructurePageRoutingModule } from './structure-routing.module';

import { StructurePage } from './structure.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    StructurePageRoutingModule
  ],
  declarations: [StructurePage]
})
export class StructurePageModule {}

