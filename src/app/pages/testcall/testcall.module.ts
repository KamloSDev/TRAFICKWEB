import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TestcallPageRoutingModule } from './testcall-routing.module';

import { TestcallPage } from './testcall.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TestcallPageRoutingModule
  ],
  declarations: [TestcallPage]
})
export class TestcallPageModule {}
