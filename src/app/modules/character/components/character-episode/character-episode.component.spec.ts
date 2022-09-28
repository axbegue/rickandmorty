import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterEpisodeComponent } from './character-episode.component';

describe('CharacterEpisodeComponent', () => {
  let component: CharacterEpisodeComponent;
  let fixture: ComponentFixture<CharacterEpisodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterEpisodeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterEpisodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
