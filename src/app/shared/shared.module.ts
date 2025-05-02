import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageUploadedComponent } from './components/image-uploaded/image-uploaded.component';
import { PokemonCardComponent } from './components/pokemon-card/pokemon-card.component';
import { PokemonListComponent } from './components/pokemon-list/pokemon-list.component';
import { FormComponent } from './components/form/form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { LoadingComponent } from './components/loading/loading.component';
import { ScrollingModule } from '@angular/cdk/scrolling';

@NgModule({
  declarations: [
    ImageUploadedComponent,
    PokemonCardComponent,
    PokemonListComponent,
    FormComponent,
    LoadingComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ScrollingModule
  ],
  exports: [
    ImageUploadedComponent,
    PokemonCardComponent,
    PokemonListComponent,
    FormComponent,
    LoadingComponent
  ]
})
export class SharedModule { }
