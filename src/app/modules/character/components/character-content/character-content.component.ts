import { animate, style, transition, trigger } from '@angular/animations';
import { OnDestroy } from '@angular/core';
import { HostBinding } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CharacterService } from '@modules/character/service/character.service';
import { Subscription } from 'rxjs';
import { Character } from 'src/app/model/character';

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

  constructor(private service: CharacterService) { }

  ngOnInit(): void {
    this.subscription = this.service.getEntitySelectionSubject$().subscribe({
      next: (result) => {
        this.currentEntity = result;
        // console.log(result);
        
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onLocationClick(location: string) {
    this.service.getEntitiesByLocationUrl(location);
  }

  onCloseClick() {
    this.currentEntity = null;
  }

}
