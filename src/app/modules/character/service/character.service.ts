import { Injectable } from '@angular/core';
import { Pagination } from '@shared/app-pagination';
import { BehaviorSubject } from 'rxjs';

import { SearchingEntity } from '@shared/util/searching-entity';
import { Character, LocationModel } from 'src/app/model';
import { CharacterBackendService } from 'src/app/service/character-backend.service';
import { Page } from '@shared/app-pagination/page';
import { LocationBackendService } from 'src/app/service/location-backend.service';
import { MathHelper } from '@shared/util/math-helper';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private pagination: Pagination = new Pagination().size(20);
  private searchingSubject$: BehaviorSubject<SearchingEntity<Character>> = 
        new BehaviorSubject<SearchingEntity<Character>>(new SearchingEntity<Character>());
  private paginationSubject$: BehaviorSubject<Pagination> = new BehaviorSubject<Pagination>(this.pagination.clone());
  private entitySelectionSubject$: BehaviorSubject<Character | null> = new BehaviorSubject<Character | null>(null);
  private textoBuscado: string = '';
  private charactersLazyload: Character[] = [];
  private onLazyload: boolean = false;

  constructor(private backend: CharacterBackendService,
    private locationBackend: LocationBackendService) { }

  public getSearchingSubject$() {
    return this.searchingSubject$;
  }

  public getPaginationSubject$() {
    return this.paginationSubject$;
  }

  public getEntitySelectionSubject$(): BehaviorSubject<Character | null> {
    return this.entitySelectionSubject$;
  }

  public findEntities(query: string, clear: boolean) {
    if (this.onLazyload) {
      console.log('findEntities onLazyload, clear: ' + clear);
      console.log('findEntities onLazyload, query: ' + query);
      
      new Promise(resolve => {
        this.findEntitiesLazyLoad(false);
      })
      return;
    }

    console.log('findEntities normal, clear: ' + clear);
    console.log('findEntities normal, query: ' + query);

    this.textoBuscado = query;
    this.searchingSubject$.next(new SearchingEntity<Character>().init());

    if (clear) {
      this.pagination.pageNumber = 1;
    }
    this.backend.searchPagead(this.pagination.getpageNumber(), this.textoBuscado).subscribe({
      next: (response: Page<Character>) => {
        this.pagination.totalPages = response.totalPages;
        this.pagination.totalElements = response.totalElements;
        this.paginationSubject$.next(this.pagination.clone());
        this.searchingSubject$.next(new SearchingEntity<Character>().clear(clear).end(response.content));
      },
      error: (error: string) => {
        this.searchingSubject$.next(new SearchingEntity<Character>().end([]));
        alert(error);
      }
    });
  }

  private findEntitiesLazyLoad(clear: boolean) {
    // if (this.entityList.length >= this.pagination.getTotalElements()) {
    //   return;
    // }
    let fromIndex: number = (this.pagination.getpageNumber()-1) * this.pagination.getPageSize();
    let toIndex: number = 0;
    if ((this.charactersLazyload.length - fromIndex - this.pagination.getPageSize()) > 0) {
      toIndex = fromIndex + this.pagination.getPageSize();
    } else {
      toIndex = fromIndex + this.charactersLazyload.length - fromIndex;
    }

    console.log('totalSlides: ' + this.charactersLazyload.length);
    console.log('pagination.getTotalElements: ' + this.pagination.getTotalElements());
    console.log('From: ' + fromIndex);
    console.log('To: ' + toIndex);

    // this.searchingSubject$.next(new SearchingEntity<Character>().init());
    this.paginationSubject$.next(this.pagination.clone());

    let characters = this.charactersLazyload.slice(fromIndex, toIndex);
    console.log(this.charactersLazyload);
    console.log(characters);
    

    this.searchingSubject$.next(new SearchingEntity<Character>().clear(clear).end(characters));
  }

  // Es llamado desde this.getEntitiesByLocationUrl
  // Y es llamado desde FilterBarService.findCharactersFromEpisode
  // Como el servidor manda todo sin paginar, las imagenes se cargarian todas a la vez por lo que pagino el contenido manualmente
  // Luego el slider tratara de paginar, donde debo dar de mi lista mientras this.onLazyload sea true
  public getEntitiesById(entityId: string) {
    this.searchingSubject$.next(new SearchingEntity<Character>().init());
    
    this.backend.getById(entityId).subscribe({
      next: (response: Character[]) => {
        this.charactersLazyload = response;
        this.onLazyload = true;

        this.pagination.pageNumber = 1;
        this.pagination.totalPages = MathHelper.roundUp(this.charactersLazyload.length / this.pagination.getPageSize(), 0);
        this.pagination.totalElements = this.charactersLazyload.length;

        this.findEntitiesLazyLoad(true);
        // this.paginationSubject$.next(this.pagination.clone());
        // this.searchingSubject$.next(new SearchingEntity<Character>().clear(true).end(this.charactersLazyload.slice(0, this.pagination.getPageSize())));
      },
      error: (error: string) => {
        this.searchingSubject$.next(new SearchingEntity<Character>().end([]));
        alert(error);
      }
    });
  }

  public getEntitiesByLocationUrl(locationUrl: string) {
    console.log(locationUrl);
    
    let locationId = locationUrl.substring(locationUrl.indexOf('api/location/')+13, locationUrl.length);
    
    this.locationBackend.getById(locationId).subscribe({
      next: (response: LocationModel) => {
        if (!response.residents || response.residents.length === 0) {
          this.searchingSubject$.next(new SearchingEntity<Character>().clear(true).end([]));
          return;
        }

        let charIds: string = '';
        response.residents.forEach((charUrl: String)=> {
          charIds += charUrl.substring(charUrl.indexOf('api/character/')+14, charUrl.length) + ',';
        });
        
        console.log(charIds);
        
        this.getEntitiesById(charIds)
      },
      error: (error: string) => {
        alert(error);
      }
    });
  }

  public pageChange(page: number) {
    console.log('pageChange ' + page);
    
    this.pagination.pageNumber = page;
    this.findEntities(this.textoBuscado, false);
  }

  public entitySelection(entity: Character | null) {
    this.entitySelectionSubject$.next(entity);
  }

  
  public onSearchPerformed(query: string, buttonClicked: boolean): void {
    this.onLazyload = false
    this.textoBuscado = query;
    if (buttonClicked) {
      this.findEntities(this.textoBuscado, true);
    }
  }
}
