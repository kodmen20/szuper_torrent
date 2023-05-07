import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { myTorrentsRoutingModule } from './myTorrents-routing.module';

import { MatTableModule } from '@angular/material/table';
import { myTorrentsComponent } from './myTorrents.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatDividerModule } from '@angular/material/divider';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  declarations: [
    myTorrentsComponent
  ],
  imports: [
    CommonModule,
    myTorrentsRoutingModule,
    MatTableModule,
    MatExpansionModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatSnackBarModule
  ]
})
export class myTorrentsModule { }
