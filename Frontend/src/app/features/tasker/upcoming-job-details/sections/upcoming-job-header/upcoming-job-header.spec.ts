import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { UpcomingJobHeader } from './upcoming-job-header';

describe('UpcomingJobHeader', () => {
  let component: UpcomingJobHeader;
  let fixture: ComponentFixture<UpcomingJobHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingJobHeader],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingJobHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
