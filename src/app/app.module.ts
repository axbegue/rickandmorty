import { NgModule, Injector } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';

import { AppComponent } from './app.component';
import { setGlobalInjector } from '@core/util/global-injector';
import { CharacterModule } from '@modules/character';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserAnimationsModule,
    // BrowserModule,
    HttpClientModule,
    MatToolbarModule,
    
    CharacterModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(injector: Injector) {
    setGlobalInjector(injector);
  }
}
