import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';

import { SlickCarouselModule } from 'ngx-slick-carousel';

import { CharacterContentComponent } from './components/character-content/character-content.component';
import { CharacterFilterComponent } from './components/character-filter/character-filter.component';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { CharacterSliderComponent } from './components/character-slider/character-slider.component';

@NgModule({
  declarations: [
    CharacterContentComponent,
    CharacterFilterComponent,
    CharacterListComponent,
    CharacterSliderComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,

    MatButtonModule,
    MatIconModule,
    MatListModule, // For first test
    // MatRadioModule,
    MatTooltipModule,

    SlickCarouselModule,
  ],
  exports: [
    CharacterContentComponent,
    CharacterFilterComponent,
    CharacterListComponent,
    CharacterSliderComponent,
  ]
})
export class CharacterModule { }
