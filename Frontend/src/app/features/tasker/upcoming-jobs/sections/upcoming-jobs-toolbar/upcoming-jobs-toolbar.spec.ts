import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpcomingJobsToolbar } from './upcoming-jobs-toolbar';

describe('UpcomingJobsToolbar', () => {
  let component: UpcomingJobsToolbar;
  let fixture: ComponentFixture<UpcomingJobsToolbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UpcomingJobsToolbar],
    }).compileComponents();

    fixture = TestBed.createComponent(UpcomingJobsToolbar);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
