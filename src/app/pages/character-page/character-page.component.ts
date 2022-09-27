import { HostBinding } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.scss']
})
export class CharacterPageComponent implements OnInit {
  @HostBinding('class') class = 'h-100';

  constructor() { }

  ngOnInit(): void {
  }

}
