import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterSwiperComponent } from './character-swiper.component';

describe('CharacterSwiperComponent', () => {
  let component: CharacterSwiperComponent;
  let fixture: ComponentFixture<CharacterSwiperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterSwiperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterSwiperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
