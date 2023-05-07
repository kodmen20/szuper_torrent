import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TorrentsComponent } from './torrents.component';

const routes: Routes = [
  { 
    path: '', component: TorrentsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TorrentsRoutingModule { }
