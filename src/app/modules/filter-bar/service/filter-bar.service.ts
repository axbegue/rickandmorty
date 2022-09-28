import { Injectable } from '@angular/core';
import { CharacterService } from '@modules/character/service';
import { Pagination } from '@shared/app-pagination';
import { Page } from '@shared/app-pagination/page';
import { SearchingEntity } from '@shared/util/searching-entity';
import { BehaviorSubject } from 'rxjs';
import { Character } from 'src/app/model';
import { Episode } from 'src/app/model/episode';
import { Season } from 'src/app/model/season';
import { EpisodeBackendService } from 'src/app/service/episode-backend.service';

@Injectable({
  providedIn: 'root'
})
export class FilterBarService {
  private pagination: Pagination = new Pagination().size(50);
  private seasonSubject$: BehaviorSubject<SearchingEntity<Season>> = 
        new BehaviorSubject<SearchingEntity<Season>>(new SearchingEntity<Season>());
  private episodeSubject$: BehaviorSubject<SearchingEntity<Episode>> = 
        new BehaviorSubject<SearchingEntity<Episode>>(new SearchingEntity<Episode>());
  private textoBuscado: string = '';

  constructor(private episodeBackend: EpisodeBackendService,
    private characterService: CharacterService) { }

  public getSeasonSubject$() {
    return this.seasonSubject$;
  }

  public getEpisodeSubject$() {
    return this.episodeSubject$;
  }

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
    // console.log(charIds);

    this.characterService.getEntitiesById(charIds);
  }

  private convertToSeason(episode: Episode): Season {
    // S01E01 => Season 01
    let season: Season = {
      code: episode.episode.substring(0, 3),
      name: `Season ${episode.episode.substring(1, 3)}`
    };
    return season;
  }
}
