import { Component, OnInit } from '@angular/core';
import { CharacterService } from '@modules/character/service';

@Component({
  selector: 'app-filter-bar',
  templateUrl: './filter-bar.component.html',
  styleUrls: ['./filter-bar.component.scss']
})
export class FilterBarComponent implements OnInit {
  private _enteredSearchValue: string = '';
  searchClicked: boolean = false;

  constructor(private service: CharacterService) { }

  ngOnInit(): void {
  }

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
