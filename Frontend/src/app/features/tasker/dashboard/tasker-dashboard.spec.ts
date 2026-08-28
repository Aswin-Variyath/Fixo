import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';

import { TaskerDashboard } from './tasker-dashboard';

describe('TaskerDashboard', () => {
  let component: TaskerDashboard;
  let fixture: ComponentFixture<TaskerDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerDashboard],
      providers: [provideHttpClient(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
