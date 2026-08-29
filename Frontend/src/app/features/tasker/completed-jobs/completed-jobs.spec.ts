import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { CompletedJobs } from './completed-jobs';

describe('CompletedJobs', () => {
  let component: CompletedJobs;
  let fixture: ComponentFixture<CompletedJobs>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompletedJobs],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(CompletedJobs);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
