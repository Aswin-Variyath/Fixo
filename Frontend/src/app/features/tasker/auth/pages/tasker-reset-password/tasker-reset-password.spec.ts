import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerResetPassword } from './tasker-reset-password';

describe('TaskerResetPassword', () => {
  let component: TaskerResetPassword;
  let fixture: ComponentFixture<TaskerResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerResetPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerResetPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
