import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { environment } from '@environment/environment';
import { DateHelper } from '@shared/util/date-helper';
import { LocationDto } from '../dto';
import { LocationModel } from '../model';

@Injectable({
  providedIn: 'root'
})
export class LocationBackendService {
  private apiServerUrl = `${environment.apiBaseUrl}/location`;

  constructor(private http: HttpClient) { }

  public getById(entityId: string): Observable<LocationModel> {
    return this.http.get<LocationDto>(`${this.apiServerUrl}/${entityId}`).pipe(
      map( (entity) => {
        // Convert Location -> Location if needed
        let location: LocationModel = { ...entity }
        
        // Repair Date
        return this.parseDates(location)
      } )
    );
  }

  private parseDates(entity: LocationModel): LocationModel {
    let fechaActual = new DateHelper().firstTimeDay();

    if (entity.created) {
      entity.created = new Date(entity.created);
    } else {
      entity.created = entity.created;
    }

    return entity;
  }
}
