import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SpecialitesPage } from './specialites.page';

const routes: Routes = [
  {
    path: '',
    component: SpecialitesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SpecialitesPageRoutingModule {}
