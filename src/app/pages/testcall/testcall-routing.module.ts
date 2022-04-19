import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TestcallPage } from './testcall.page';

const routes: Routes = [
  {
    path: '',
    component: TestcallPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TestcallPageRoutingModule {}
