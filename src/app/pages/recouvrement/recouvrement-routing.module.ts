import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RecouvrementPage } from './recouvrement.page';

const routes: Routes = [
  {
    path: '',
    component: RecouvrementPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RecouvrementPageRoutingModule {}
