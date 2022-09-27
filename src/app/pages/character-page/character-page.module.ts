import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CharacterPageRoutingModule } from './character-page-routing.module';
import { CharacterPageComponent } from './character-page.component';
import { CharacterModule } from '@modules/character/character.module';


@NgModule({
  declarations: [
    CharacterPageComponent
  ],
  imports: [
    CommonModule,
    CharacterPageRoutingModule,
    CharacterModule
  ]
})
export class CharacterPageModule { }
