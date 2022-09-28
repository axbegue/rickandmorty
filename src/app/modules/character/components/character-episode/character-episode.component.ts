import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Episode } from 'src/app/model';

@Component({
  selector: 'app-character-episode',
  templateUrl: './character-episode.component.html',
  styleUrls: ['./character-episode.component.scss']
})
export class CharacterEpisodeComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public episodes: Episode[],
    public dialogRef: MatDialogRef<CharacterEpisodeComponent>) { }

  ngOnInit(): void {
  }

  onClose() {
    this.dialogRef.close();
  }

}
