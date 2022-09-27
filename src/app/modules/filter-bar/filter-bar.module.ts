import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FilterBarComponent } from './components/filter-bar/filter-bar.component';
import { FormsModule } from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';


@NgModule({
  declarations: [
    FilterBarComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatIconModule
  ],
  exports: [
    FilterBarComponent
  ]
})
export class FilterBarModule { }
