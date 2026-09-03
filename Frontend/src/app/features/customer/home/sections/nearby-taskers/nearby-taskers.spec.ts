import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NearbyTaskers } from './nearby-taskers';

describe('NearbyTaskers', () => {
  let component: NearbyTaskers;
  let fixture: ComponentFixture<NearbyTaskers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NearbyTaskers],
    }).compileComponents();

    fixture = TestBed.createComponent(NearbyTaskers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
