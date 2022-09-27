import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharacterListComponent } from './components/character-list/character-list.component';
import { MatListModule } from '@angular/material/list';
import { CharacterSliderComponent } from './components/character-slider/character-slider.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SlickCarouselModule } from 'ngx-slick-carousel';
import {MatCardModule} from '@angular/material/card';
import {MatRadioModule} from '@angular/material/radio';
import { CharacterContentComponent } from './components/character-content/character-content.component';

@NgModule({
  declarations: [
    CharacterListComponent,
    CharacterSliderComponent,
    CharacterContentComponent
  ],
  imports: [
    CommonModule,
    MatListModule,

    MatRadioModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    SlickCarouselModule
  ],
  exports: [
    CharacterListComponent,
    CharacterSliderComponent,
    CharacterContentComponent
  ]
})
export class CharacterModule { }
