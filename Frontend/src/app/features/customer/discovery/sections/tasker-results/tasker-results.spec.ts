import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerResults } from './tasker-results';

describe('TaskerResults', () => {
  let component: TaskerResults;
  let fixture: ComponentFixture<TaskerResults>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerResults],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerResults);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
