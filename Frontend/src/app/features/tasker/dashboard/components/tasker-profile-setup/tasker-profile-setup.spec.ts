import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerProfileSetup } from './tasker-profile-setup';

describe('TaskerProfileSetup', () => {
  let component: TaskerProfileSetup;
  let fixture: ComponentFixture<TaskerProfileSetup>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerProfileSetup],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerProfileSetup);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
