import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CharacterService } from '@modules/character/service';
import { FilterBarService } from '@modules/character/service/filter-bar.service';
import { Subscription } from 'rxjs';
import { Episode, Season } from 'src/app/model';

@Component({
  selector: 'app-character-filter',
  templateUrl: './character-filter.component.html',
  styleUrls: ['./character-filter.component.scss']
})
export class CharacterFilterComponent implements OnInit, OnDestroy {
  public seasonList: Season[] = [];
  public episodeList: Episode[] = [];
  private _enteredSearchValue: string = '';
  searchClicked: boolean = false;
  private subscription!: Subscription;
  private episodeSubs!: Subscription;

  constructor(private service: FilterBarService,
    private characterService: CharacterService) { }

  ngOnInit(): void {
    this.service.findAllSeasons();

    this.subscription = this.service.getSeasonSubject$().subscribe({
      next: (result) => {
        if (result.found) {
          this.seasonList.splice(0, this.seasonList.length)
          result.entityList.forEach( val => this.seasonList.push(Object.assign({}, val)) );
        }
      }
    });
    this.episodeSubs = this.service.getEpisodeSubject$().subscribe({
      next: (result) => {
        if (result.found) {
          this.episodeList.splice(0, this.episodeList.length)
          result.entityList.forEach( val => this.episodeList.push(Object.assign({}, val)) );
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.episodeSubs.unsubscribe();
  }
  
  public onSeasonChange(event: Event) {
    // console.log((event.target as HTMLInputElement).value);
    let code = (event.target as HTMLInputElement).value;
    if (code === '') {
      this.episodeList.splice(0, this.episodeList.length);
      this.onSearchPerformed();
      return;
    }

    let season = this.seasonList.find(val => val.code === code);
    this.service.findEpisodesFromSeason(season!);
  }

  public onEpisodeChange(event: Event) {
    let code = (event.target as HTMLInputElement).value;
    if (code === '') {
      this.onSearchPerformed();
      return;
    }
    let episode = this.episodeList.find(val => val.episode === code);
    this.service.findCharactersFromEpisode(episode!);
  }

  public onSearchPerformed() {
    this.searchClicked = true;
    this.characterService.onSearchPerformed!(this._enteredSearchValue, true);
  }
  
  get enteredSearchValue(): string {
    return this._enteredSearchValue;
  }

  set enteredSearchValue(val: string) {
    if (this.searchClicked && this._enteredSearchValue !== '' && val === '') {
      this._enteredSearchValue = val;
      this.characterService.onSearchPerformed(val, true);
      return;
    }
    this.searchClicked = false;
    this._enteredSearchValue = val;
    this.characterService.onSearchPerformed!(val, false);
  }
}
