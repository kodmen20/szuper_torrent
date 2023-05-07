import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { myTorrentsComponent } from './myTorrents.component';

const routes: Routes = [
  { 
    path: '', component: myTorrentsComponent 
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class myTorrentsRoutingModule { }
