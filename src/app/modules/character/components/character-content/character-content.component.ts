import { animate, style, transition, trigger } from '@angular/animations';
import { OnDestroy } from '@angular/core';
import { HostBinding } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { environment } from '@environment/environment';
import { CharacterService } from '@modules/character/service/character.service';
import { FilterService } from '@modules/character/service/filter.service';
import { Subscription } from 'rxjs';
import { Episode } from 'src/app/model';
import { Character } from 'src/app/model/character';
import { AppCommonService } from 'src/app/service';
import { CharacterEpisodeComponent } from '../character-episode/character-episode.component';

@Component({
  selector: 'app-character-content',
  templateUrl: './character-content.component.html',
  styleUrls: ['./character-content.component.scss'],
  animations: [
    trigger("myAnimation", [
      transition(":enter", [
        style({opacity: 0 }),
        animate(
          "800ms",
          style({
            opacity: 1
          })
        ),
      ]),
      transition(":leave", [
        style({opacity: 1 }),
        animate(
          "800ms",
          style({
            opacity: 0
          })
        ),
      ]),
    ]),
  ]
})
export class CharacterContentComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'h-100';
  public currentEntity: Character | null = null;
  private subscription!: Subscription;

  constructor(private service: CharacterService,
    private filterService: FilterService,
    public dialog: MatDialog,
    private commonService: AppCommonService) { }

  ngOnInit(): void {
    this.subscription = this.service.getEntitySelectionSubject$().subscribe({
      next: (result) => {
        this.currentEntity = result;
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLocationClick(location: string) {
    this.filterService.getEntitiesByLocationUrl(location);
  }

  onCloseClick() {
    this.currentEntity = null;
  }

  onEpisodiosClick() {
    this.commonService.getProgressBarSpinSubject$().next(true);

    this.filterService.getEpisodesFromCharacter(this.currentEntity!).subscribe({
      next: (response: Episode[]) => {
        this.commonService.getProgressBarSpinSubject$().next(false);

        let episodes: Episode[] = [];
        response.forEach(val => episodes.push( val ));
        
        this.dialog.open(CharacterEpisodeComponent, {data: episodes});
      },
      error: (error: string) => {
        this.commonService.getProgressBarSpinSubject$().next(false);
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
