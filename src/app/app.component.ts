import { HostBinding } from '@angular/core';
import { Component } from '@angular/core';
import { CharacterService } from '@modules/character/service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  @HostBinding('class') class = 'h-100';
  private _enteredSearchValue: string = '';
  searchClicked: boolean = false;
  title = 'angular-rick';

  constructor(private service: CharacterService) { }

  public onSearchPerformed() {
    this.searchClicked = true;
    this.service.onSearchPerformed!(this._enteredSearchValue, true);
  }
  
  get enteredSearchValue(): string {
    return this._enteredSearchValue;
  }

  set enteredSearchValue(val: string) {
    if (this.searchClicked && this._enteredSearchValue !== '' && val === '') {
      this.service.onSearchPerformed(val, true);
      return;
    }
    this.searchClicked = false;
    this._enteredSearchValue = val;
    this.service.onSearchPerformed!(val, false);
  }
}