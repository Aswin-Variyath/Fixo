import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobActionsCard } from './job-actions-card';

describe('JobActionsCard', () => {
  let component: JobActionsCard;
  let fixture: ComponentFixture<JobActionsCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobActionsCard],
    }).compileComponents();

    fixture = TestBed.createComponent(JobActionsCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
