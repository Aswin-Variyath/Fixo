import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobLocationCard } from './job-location-card';

describe('JobLocationCard', () => {
  let component: JobLocationCard;
  let fixture: ComponentFixture<JobLocationCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobLocationCard],
    }).compileComponents();

    fixture = TestBed.createComponent(JobLocationCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
