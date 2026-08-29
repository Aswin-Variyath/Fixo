import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UpcomingJobsEmpty } from './upcoming-jobs-empty';

describe('UpcomingJobsEmpty', () => {
  let component: UpcomingJobsEmpty;
  let fixture: ComponentFixture<UpcomingJobsEmpty>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingJobsEmpty],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingJobsEmpty);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
