import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectionListChange } from '@angular/material/list';
import { environment } from '@environment/environment';
import { FilterService } from '@modules/character/service/filter.service';
import { Episode } from 'src/app/model';

@Component({
  selector: 'app-character-episode',
  templateUrl: './character-episode.component.html',
  styleUrls: ['./character-episode.component.scss']
})
export class CharacterEpisodeComponent implements OnInit {

  constructor(private filterService: FilterService,
    @Inject(MAT_DIALOG_DATA) public episodes: Episode[],
    private dialogRef: MatDialogRef<CharacterEpisodeComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

  onSelectionChange(event: MatSelectionListChange) {
    this.filterService.findCharactersFromEpisode(event.options[0]!.value);
    this.dialogRef.close();
  }

  private log(value: any) {
    if (!environment.production) {
      console.log(value);
    }
  }

}
