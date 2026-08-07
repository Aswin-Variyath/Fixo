import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerSignup } from './tasker-signup';

describe('TaskerSignup', () => {
  let component: TaskerSignup;
  let fixture: ComponentFixture<TaskerSignup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerSignup],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerSignup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
