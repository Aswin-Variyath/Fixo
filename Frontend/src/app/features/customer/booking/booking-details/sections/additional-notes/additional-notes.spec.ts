import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalNotesSection } from './additional-notes';

describe('AdditionalNotesSection', () => {
  let component: AdditionalNotesSection;
  let fixture: ComponentFixture<AdditionalNotesSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionalNotesSection],
    }).compileComponents();

    fixture = TestBed.createComponent(AdditionalNotesSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
