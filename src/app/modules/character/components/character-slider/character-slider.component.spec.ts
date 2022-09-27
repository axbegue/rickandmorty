import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSliderComponent } from './character-slider.component';

describe('CharacterSliderComponent', () => {
  let component: CharacterSliderComponent;
  let fixture: ComponentFixture<CharacterSliderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterSliderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterSliderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
