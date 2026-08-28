import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisibilityBanner } from './visibility-banner';

describe('VisibilityBanner', () => {
  let component: VisibilityBanner;
  let fixture: ComponentFixture<VisibilityBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VisibilityBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(VisibilityBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
