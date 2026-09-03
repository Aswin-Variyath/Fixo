import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletedJobsHeader } from './completed-jobs-header';

describe('CompletedJobsHeader', () => {
  let component: CompletedJobsHeader;
  let fixture: ComponentFixture<CompletedJobsHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedJobsHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedJobsHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
