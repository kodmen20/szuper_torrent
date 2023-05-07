import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TorrentsRoutingModule } from './torrents-routing.module';
import { TorrentsComponent } from './torrents.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';


@NgModule({
  declarations: [
    TorrentsComponent
  ],
  imports: [
    CommonModule,
    TorrentsRoutingModule,
    MatCardModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule
  ]
})
export class TorrentsModule { }
