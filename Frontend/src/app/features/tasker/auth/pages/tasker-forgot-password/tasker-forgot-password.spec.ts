import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerForgotPassword } from './tasker-forgot-password';

describe('TaskerForgotPassword', () => {
  let component: TaskerForgotPassword;
  let fixture: ComponentFixture<TaskerForgotPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerForgotPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerForgotPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
