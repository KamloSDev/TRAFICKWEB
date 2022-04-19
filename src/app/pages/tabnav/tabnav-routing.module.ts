import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabnavPage } from './tabnav.page';

// const routes: Routes = [
//   {
//     path: '',
//     component: TabnavPage
//   },
//   {
//     path: 'home',
//     loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
//   },
//   {
//     path: 'doctors',
//     loadChildren: () => import('../doctors/doctors.module').then(m => m.DoctorsPageModule)
//   },

// ];

const routes: Routes = [
  {
    path: '',
    component: TabnavPage,
    children: [
      {
        path: 'home',
        loadChildren: () => import('../home/home.module').then(m => m.HomePageModule)
      },
      {
        path: 'structures',
        loadChildren: () => import('../structures/structures.module').then(m => m.StructuresPageModule)
      },
      {
        path: 'doctors',
        loadChildren: () => import('../doctors/doctors.module').then(m => m.DoctorsPageModule)
      }
      ,
      // ,
      // {
      //   path: 'tab3',
      //   loadChildren: () => import('../tab3/tab3.module').then(m => m.Tab3PageModule)
      // },
      {
        path: '',
        redirectTo: 'tab-nav/home',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '',
    redirectTo: 'tab-nav/home',
    pathMatch: 'full'
  }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabnavPageRoutingModule {}
