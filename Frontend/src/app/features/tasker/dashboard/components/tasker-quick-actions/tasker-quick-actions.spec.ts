import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerQuickActions } from './tasker-quick-actions';

describe('TaskerQuickActions', () => {
  let component: TaskerQuickActions;
  let fixture: ComponentFixture<TaskerQuickActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerQuickActions],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerQuickActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
