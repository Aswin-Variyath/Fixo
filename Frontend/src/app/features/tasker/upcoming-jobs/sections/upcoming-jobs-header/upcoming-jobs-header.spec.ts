import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UpcomingJobsHeader } from './upcoming-jobs-header';

describe('UpcomingJobsHeader', () => {
  let component: UpcomingJobsHeader;
  let fixture: ComponentFixture<UpcomingJobsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingJobsHeader],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingJobsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
