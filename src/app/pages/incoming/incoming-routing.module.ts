import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { IncomingPage } from './incoming.page';

const routes: Routes = [
  {
    path: '',
    component: IncomingPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class IncomingPageRoutingModule {}
