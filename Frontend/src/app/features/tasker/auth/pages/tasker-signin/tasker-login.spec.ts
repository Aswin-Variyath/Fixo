import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerLogin } from './tasker-login';

describe('TaskerLogin', () => {
  let component: TaskerLogin;
  let fixture: ComponentFixture<TaskerLogin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerLogin],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerLogin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
