import { OnDestroy } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { CharacterService } from '@modules/character/service/character.service';
import { Subscription } from 'rxjs';
import { CharacterDto } from 'src/app/dto/character-dto';

@Component({
  selector: 'app-character-list',
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss']
})
export class CharacterListComponent implements OnInit, OnDestroy {
  public entityList: CharacterDto[] = [];
  // private subscription!: Subscription;

  constructor(private service: CharacterService) { }

  ngOnInit(): void {
    // this.service.findEntities('', true);
    // this.subscription = this.service.getSearchingSubject$().subscribe({
    //   next: (result) => {
    //     if (result.searching) {
    //       // this.spinner.show();
    //     } else {
    //       // this.spinner.hide();
    //       this.entityList.splice(0, this.entityList.length)
    //       result.entityList.forEach(val => this.entityList.push(Object.assign({}, val)));
    //       console.log(this.entityList);
          
    //     }
    //   }
    // });
  }
  
  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
  }

}
