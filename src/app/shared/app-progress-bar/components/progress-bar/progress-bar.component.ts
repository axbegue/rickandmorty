import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {
  @Input() public showSpinner: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

  public visible(visible: boolean) {
    this.showSpinner = visible;
  }

  public show(): void {
    this.showSpinner = true;
  }

  public hide(): void {
    this.showSpinner = false;
  }

  public isSpinning(): boolean {
    return this.showSpinner;
  }
}
