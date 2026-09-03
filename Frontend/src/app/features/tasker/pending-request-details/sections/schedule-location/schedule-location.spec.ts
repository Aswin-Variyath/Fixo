import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleLocation } from './schedule-location';

describe('ScheduleLocation', () => {
  let component: ScheduleLocation;
  let fixture: ComponentFixture<ScheduleLocation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleLocation],
    }).compileComponents();

    fixture = TestBed.createComponent(ScheduleLocation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
