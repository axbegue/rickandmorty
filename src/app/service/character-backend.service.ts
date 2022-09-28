import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

import { environment } from 'src/environments/environment';
import { PageDto } from '../dto/page-dto';
import { CharacterDto } from '../dto/character-dto';
import { DateHelper } from '@shared/util/date-helper';
import { Character } from '../model/character';
import { Page } from '@shared/app-pagination/page';

@Injectable({
  providedIn: 'root'
})
export class CharacterBackendService {
  private apiServerUrl = `${environment.apiBaseUrl}/character`;

  constructor(private http: HttpClient) { }

  public getById(entityId: string): Observable<Character[]> {
    return this.http.get<Character[]>(`${this.apiServerUrl}/${entityId}`).pipe(
      map( (entity) => {
        entity.forEach(val => this.parseDates(val));
        return entity
      } )
    );
  }

  public getAllPagead(page: number, size?: number): Observable<Page<Character>> {
    return this.http.get<PageDto<CharacterDto>>(`${this.apiServerUrl}?page=${page}`).pipe(
      map(data => {
        // Conver PageDto -> Page
        let page = new Page<Character>(data.info.pages, data.info.count);
        
        // Convert CharacterDto -> Character if needed
        page.content = data.results;

        // Repair Date
        page.content.forEach(entity => this.parseDates(entity));
        return page;
      })
    );
  }

  public searchPagead(page: number, filter: string, size?: number): Observable<Page<Character>> {
    if ((!filter || filter.length === 0)) {
      return this.getAllPagead(page, size);
    }

    let query: string = `?page=${page}`;
    if (filter && filter.length > 0) {
      query = `${query}&name=${filter}`;
    }
    
    return this.http.get<PageDto<CharacterDto>>(`${this.apiServerUrl}${query}`).pipe(
      map(data => {
        // Conver PageDto -> Page
        let page = new Page<Character>(data.info.pages, data.info.count);
        
        // Convert CharacterDto -> Character if needed
        page.content = data.results;

        // Repair Date
        page.content.forEach(entity => this.parseDates(entity));
        return page;
      })
    );
  }

  private parseDates(entity: Character): Character {
    let fechaActual = new DateHelper().firstTimeDay();

    if (entity.created) {
      entity.created = new Date(entity.created);
    } else {
      entity.created = entity.created;
    }

    return entity;
  }
}
