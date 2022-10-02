import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppCommonService {
  private progressBarSpinSubject$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  
  constructor() { }
  
  public getProgressBarSpinSubject$(): BehaviorSubject<boolean> {
    return this.progressBarSpinSubject$;
  }
}
