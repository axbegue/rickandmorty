import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { DateHelper } from '@shared/util/date-helper';
import { Page } from '@shared/app-pagination/page';
import { EpisodeDto, PageDto } from '../dto';
import { Episode } from '../model';

@Injectable({
  providedIn: 'root'
})
export class EpisodeBackendService {
  private apiServerUrl = `${environment.apiBaseUrl}/episode`;

  constructor(private http: HttpClient) { }

  public getById(entityId: string): Observable<Episode[]> {
    this.log(`====== Episode BACKEND.getById: ${entityId} ======`);

    return this.http.get<EpisodeDto[]>(`${this.apiServerUrl}/${entityId}`).pipe(
      map( (entity) => {
        // Convert CharacterDto -> Character if needed
        
        // Repair Date
        entity.forEach(val => this.parseDates(val));
        return entity
      } )
    );
  }

  public getAllPagead(page: number, size?: number): Observable<Page<Episode>> {
    return this.http.get<PageDto<EpisodeDto>>(`${this.apiServerUrl}?page=${page}`).pipe(
      map(data => {
        // Conver PageDto -> Page
        let page = new Page<Episode>(data.info.pages, data.info.count);
        
        // Convert CharacterDto -> Character if needed
        page.content = data.results;

        // Repair Date
        page.content.forEach(entity => this.parseDates(entity));
        return page;
      })
    );
  }

  public searchPagead(page: number, filter: string, size?: number): Observable<Page<Episode>> {
    if ((!filter || filter.length === 0)) {
      return this.getAllPagead(page, size);
    }

    let query: string = `?page=${page}`;
    if (filter && filter.length > 0) {
      query = `${query}&episode=${filter}`;
    }
    
    return this.http.get<PageDto<EpisodeDto>>(`${this.apiServerUrl}${query}`).pipe(
      map(data => {
        // Conver PageDto -> Page
        let page = new Page<Episode>(data.info.pages, data.info.count);
        
        // Convert CharacterDto -> Character if needed
        page.content = data.results;

        // Repair Date
        page.content.forEach(entity => this.parseDates(entity));
        return page;
      })
    );
  }

  private parseDates(entity: Episode): Episode {
    let fechaActual = new DateHelper().firstTimeDay();

    if (entity.created) {
      entity.created = new Date(entity.created);
    } else {
      entity.created = entity.created;
    }

    return entity;
  }

  private log(value: any) {
    if (!environment.production) {
      console.log(value);
    }
  }
}
