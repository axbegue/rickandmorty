import { HostBinding, Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { ProgressBarComponent } from '@shared/app-progress-bar/components';
import { Subscription } from 'rxjs';
import { AppCommonService } from './service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  @HostBinding('class') class = 'h-100';
  @ViewChild(ProgressBarComponent, {static: true}) spinner!: ProgressBarComponent;
  title = 'angular-rick';
  private subscription!: Subscription;

  constructor(private service: AppCommonService) { }

  ngOnInit(): void {
    this.subscription = this.service.getProgressBarSpinSubject$().subscribe({
      next: (result) => {
        this.spinner.visible(result);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
