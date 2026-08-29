import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobScheduleCard } from './job-schedule-card';

describe('JobScheduleCard', () => {
  let component: JobScheduleCard;
  let fixture: ComponentFixture<JobScheduleCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobScheduleCard],
    }).compileComponents();

    fixture = TestBed.createComponent(JobScheduleCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
