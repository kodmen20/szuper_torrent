import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './shared/services/auth.guard';

const routes: Routes = [
  { 
    path: '', 
    loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule) 
  },
  { 
    path: 'torrents', 
    loadChildren: () => import('./pages/torrents/torrents.module').then(m => m.TorrentsModule) 
  },
  { 
    path: 'login', 
    loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule) 
  },
  { 
    path: 'login/register', 
    loadChildren: () => import('./pages/register/register.module').then(m => m.RegisterModule) 
  },
  { 
    path: 'upload', 
    loadChildren: () => import('./pages/upload/upload.module').then(m => m.UploadModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'premium', 
    loadChildren: () => import('./pages/premium/premium.module').then(m => m.PremiumModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'myTorrents', 
    loadChildren: () => import('./pages/myTorrents/myTorrents.module').then(m => m.myTorrentsModule) 
  },
  {
    path: '**', 
    loadChildren: () => import('./pages/errors/not-found/not-found.module').then(m => m.NotFoundModule) 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
