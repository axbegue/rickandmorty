import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { Page } from '@shared/app-pagination';
import { SearchingEntity } from '@shared/util/searching-entity';
import { EpisodeBackendService, LocationBackendService } from 'src/app/service';
import { Character, Episode, LocationModel, Season } from 'src/app/model';
import { CharacterService } from '@modules/character/service';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private seasonSubject$: BehaviorSubject<SearchingEntity<Season>> = 
        new BehaviorSubject<SearchingEntity<Season>>(new SearchingEntity<Season>());
  private episodeSubject$: BehaviorSubject<SearchingEntity<Episode>> = 
        new BehaviorSubject<SearchingEntity<Episode>>(new SearchingEntity<Episode>());
  private filterSetSubject$: BehaviorSubject<string> = new BehaviorSubject<string>('');

  constructor(private episodeBackend: EpisodeBackendService,
    private locationBackend: LocationBackendService,
    private characterService: CharacterService) { }

  public getSeasonSubject$() {
    return this.seasonSubject$;
  }

  public getEpisodeSubject$() {
    return this.episodeSubject$;
  }

  public getFilterSetSubject$() {
    return this.filterSetSubject$;
  }

  // ======= Seasons/Episode Filters =======
  public findAllSeasons() {
    this.seasonSubject$.next(new SearchingEntity<Season>().init());
    
    this.episodeBackend.searchPagead(1, 'E01').subscribe({
      next: (response: Page<Episode>) => {
        let seasons: Season[] = [];
        response.content.forEach(val => seasons.push( this.convertToSeason(val) ));
        this.seasonSubject$.next(new SearchingEntity<Season>().end(seasons));
      },
      error: (error: string) => {
        this.seasonSubject$.next(new SearchingEntity<Season>().end([]));
        alert(error);
      }
    });
  }

  public findEpisodesFromSeason(season: Season) {
    this.episodeSubject$.next(new SearchingEntity<Episode>().init());
    
    this.episodeBackend.searchPagead(1, season.code).subscribe({
      next: (response: Page<Episode>) => {
        let episodes: Episode[] = [];
        response.content.forEach(val => episodes.push( val ));
        this.episodeSubject$.next(new SearchingEntity<Episode>().end(episodes));
      },
      error: (error: string) => {
        this.episodeSubject$.next(new SearchingEntity<Episode>().end([]));
        alert(error);
      }
    });
  }

  public findCharactersFromEpisode(episode: Episode) {
    let charIds: string = '';
    episode.characters.forEach((charUrl: String)=> {
      charIds += charUrl.substring(charUrl.indexOf('api/character/')+14, charUrl.length) + ',';
    });
    this.filterSetSubject$.next(episode.episode);
    this.characterService.getEntitiesById(charIds);
  }

  public findCharactersFromEpisodeStr(episode: string) {
    if (!episode.match(/S\d\dE\d\d/)) {
      alert('Bad episode code');
      return;
    }

    this.episodeBackend.getByEpisode(episode).subscribe({
      next: (response: Page<Episode>) => {
        let episodes: Episode[] = [];
        response.content.forEach(val => episodes.push( val ));
        if (!episodes || episodes.length === 0 || episodes.length > 1) {
          alert('Episode not found!');
          return;
        }
        this.findCharactersFromEpisode(episodes[0]);
      },
      error: (error: string) => {
        alert('Episode not found!');
      }
    });
  }

  public getEpisodesFromCharacter(character: Character): Observable<Episode[]> {
    let episodesId: string = '';
    character.episode.forEach((episodeUrl: String)=> {
      episodesId += episodeUrl.substring(episodeUrl.indexOf('api/episode/')+12, episodeUrl.length) + ',';
    });
    return this.episodeBackend.getById(episodesId);
  }

  private convertToSeason(episode: Episode): Season {
    // S01E01 => Season 01
    let season: Season = {
      code: episode.episode.substring(0, 3),
      name: `Season ${episode.episode.substring(1, 3)}`
    };
    return season;
  }
  
  // ======= Location/Origin Filters =======
  // Location code: location(#)
  // TODO: Agregar busqueda location(location name)
  public getEntitiesByLocationCode(locationCode: string) {
    if (!locationCode.match(/location\(\d*\)/)) {
      alert('Bad location code');
      return;
    }
    let partial = locationCode.replace('location(', '');
    let locationId = partial.replace(')', '');
    this.getEntitiesByLocationId(locationId);
  }

  public getEntitiesByLocationUrl(locationUrl: string) {
    let locationId = locationUrl.substring(locationUrl.indexOf('api/location/')+13, locationUrl.length);
    this.getEntitiesByLocationId(locationId);
  }

  public getEntitiesByLocationId(locationId: string) {
    this.locationBackend.getById(locationId).subscribe({
      next: (response: LocationModel) => {
        if (!response.residents || response.residents.length === 0) {
          this.characterService.getSearchingSubject$().next(new SearchingEntity<Character>().clear(true).end([]));
          return;
        }

        let charIds: string = '';
        response.residents.forEach((charUrl: String)=> {
          charIds += charUrl.substring(charUrl.indexOf('api/character/')+14, charUrl.length) + ',';
        });
        
        // this.log(charIds);
        this.filterSetSubject$.next(`location(${response.id})`);
        this.characterService.getEntitiesById(charIds)
      },
      error: (error: string) => {
        alert(error);
      }
    });
  }

  private log(value: any) {
    if (!environment.production) {
      console.log(value);
    }
  }
}
