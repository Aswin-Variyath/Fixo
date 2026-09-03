import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeroContent } from './hero-content';

describe('HeroContent', () => {
  let component: HeroContent;
  let fixture: ComponentFixture<HeroContent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HeroContent],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroContent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
