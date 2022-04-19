import { TabnavPageModule } from './pages/tabnav/tabnav.module';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'tab-nav',
    loadChildren: () => import('./pages/tabnav/tabnav.module').then(m => m.TabnavPageModule)
  },

  {
    path: 'login',
    loadChildren: () => import('./pages/login/login.module').then( m => m.LoginPageModule)
  },
  {
    path: 'consultations',
    loadChildren: () => import('./pages/consultations/consultations.module').then( m => m.ConsultationsPageModule)
  },
  {
    path: 'inscription',
    loadChildren: () => import('./pages/inscription/inscription.module').then( m => m.InscriptionPageModule)
  },
  {
    path: 'recouvrement',
    loadChildren: () => import('./pages/recouvrement/recouvrement.module').then( m => m.RecouvrementPageModule)
  },
  {
    path: 'doctor',
    loadChildren: () => import('./pages/doctor/doctor.module').then( m => m.DoctorPageModule)
  },
  {
    path: 'specialites',
    loadChildren: () => import('./pages/specialites/specialites.module').then( m => m.SpecialitesPageModule)
  },
  {
    path: 'discussions',
    loadChildren: () => import('./pages/discussions/discussions.module').then( m => m.DiscussionsPageModule)
  },
  {
    path: 'discussion',
    loadChildren: () => import('./pages/discussion/discussion.module').then( m => m.DiscussionPageModule)
  }
  ,
  {
    path: 'discussion/:user/:doctor',
    loadChildren: () => import('./pages/discussion/discussion.module').then( m => m.DiscussionPageModule)
  },
  {
    path: 'profil',
    loadChildren: () => import('./pages/profil/profil.module').then( m => m.ProfilPageModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./pages/dashboard/dashboard.module').then( m => m.DashboardPageModule)
  },
  {
    path: 'resume',
    loadChildren: () => import('./pages/resume/resume.module').then( m => m.ResumePageModule)
  },
  {
    path: 'carnet',
    loadChildren: () => import('./pages/carnet/carnet.module').then( m => m.CarnetPageModule)
  },
  {
    path: 'structures',
    loadChildren: () => import('./pages/structures/structures.module').then( m => m.StructuresPageModule)
  },
  {
    path: 'phone',
    loadChildren: () => import('./pages/phone/phone.module').then( m => m.PhonePageModule)
  },
  {
    path: 'verification',
    loadChildren: () => import('./pages/verification/verification.module').then( m => m.VerificationPageModule)
  },
  {
    path: 'map',
    loadChildren: () => import('./pages/map/map.module').then( m => m.MapPageModule)
  },
  {
    path: 'add-structure',
    loadChildren: () => import('./pages/add-structure/add-structure.module').then( m => m.AddStructurePageModule)
  },
  {
    path: 'structure',
    loadChildren: () => import('./pages/structure/structure.module').then( m => m.StructurePageModule)
  },
  {
    path: 'call',
    loadChildren: () => import('./pages/call/call.module').then( m => m.CallPageModule)
  },
  {
    path: 'incoming',
    loadChildren: () => import('./pages/incoming/incoming.module').then( m => m.IncomingPageModule)
  },
  {
    path: 'testcall',
    loadChildren: () => import('./pages/testcall/testcall.module').then( m => m.TestcallPageModule)
  }
  // ,
  // {
  //   path: 'home',
  //   loadChildren: () => import('./pages/home/home.module').then( m => m.HomePageModule)
  // },
  // {
  //   path: 'doctors',
  //   loadChildren: () => import('./pages/doctors/doctors.module').then( m => m.DoctorsPageModule)
  // }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
