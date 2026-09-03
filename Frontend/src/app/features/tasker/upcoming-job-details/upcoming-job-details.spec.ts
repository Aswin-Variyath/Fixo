import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { UpcomingJobDetails } from './upcoming-job-details';

describe('UpcomingJobDetails', () => {
  let component: UpcomingJobDetails;
  let fixture: ComponentFixture<UpcomingJobDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingJobDetails],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingJobDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
