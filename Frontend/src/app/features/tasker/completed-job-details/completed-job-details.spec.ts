import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CompletedJobDetails } from './completed-job-details';

describe('CompletedJobDetails', () => {
  let component: CompletedJobDetails;
  let fixture: ComponentFixture<CompletedJobDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedJobDetails],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedJobDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
