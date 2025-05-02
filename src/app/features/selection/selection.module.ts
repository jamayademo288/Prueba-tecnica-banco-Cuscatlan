import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SelectionRoutingModule } from './selection-routing.module';
import { SelectionComponent } from './selection.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    SelectionComponent
  ],
  imports: [
    CommonModule,
    SelectionRoutingModule,
    SharedModule
  ]
})
export class SelectionModule { }
