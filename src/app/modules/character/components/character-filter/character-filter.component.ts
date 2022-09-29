import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { environment } from '@environment/environment';
import { CharacterService } from '@modules/character/service';
import { FilterService } from '@modules/character/service/filter.service';
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
  private _selectionTemporada: string = '';
  private _selectionEpisodio: string = '';
  private subscription!: Subscription;
  private episodeSubs!: Subscription;
  private searchClicked: boolean = false;
  private filtersSubs!: Subscription;

  constructor(private service: FilterService,
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
    this.filtersSubs = this.service.getFilterSetSubject$().subscribe({
      next: (result) => {
        if (result !== '') {
          this.enteredSearchValue = result;
          this.searchClicked = true;
        }
      }
    });
  }
  
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.episodeSubs.unsubscribe();
    this.filtersSubs.unsubscribe();
  }
  
  public onSeasonChange(event: Event) {
    // this.log((event.target as HTMLInputElement).value);
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
    if (this._enteredSearchValue.match(/S\d\dE\d\d/)) {
      this.service.findCharactersFromEpisodeStr(this._enteredSearchValue!);
      return;
    } else if (this._enteredSearchValue.match(/location\(\d*\)/)) {
      this.service.getEntitiesByLocationCode(this._enteredSearchValue!);
      return;
    }

    this.searchClicked = true;
    this.characterService.searchEntity(this._enteredSearchValue);
    this.selectionTemporada = '';
    this.selectionEpisodio = '';
  }
  
  get enteredSearchValue(): string {
    return this._enteredSearchValue;
  }

  set enteredSearchValue(val: string) {
    if (this.searchClicked && this._enteredSearchValue !== '' && val === '') {
      this.characterService.searchEntity(val);
      this.selectionTemporada = '';
      this.selectionEpisodio = '';
    }
    this.searchClicked = false;
    this._enteredSearchValue = val;
  }
  
  public get selectionTemporada(): string {
    return this._selectionTemporada;
  }

  public set selectionTemporada(value: string) {
    this.log(value);

    this._selectionTemporada = value;
  }

  public get selectionEpisodio(): string {
    return this._selectionEpisodio;
  }

  public set selectionEpisodio(value: string) {
    this.log(value);

    this._selectionEpisodio = value;
  }

  private log(value: any) {
    if (!environment.production) {
      console.log(value);
    }
  }
}
