import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CharacterContentComponent } from './character-content.component';

describe('CharacterContentComponent', () => {
  let component: CharacterContentComponent;
  let fixture: ComponentFixture<CharacterContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CharacterContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CharacterContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
