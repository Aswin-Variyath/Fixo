import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { UpcomingJobs } from './upcoming-jobs';

describe('UpcomingJobs', () => {
  let component: UpcomingJobs;
  let fixture: ComponentFixture<UpcomingJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingJobs],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingJobs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
