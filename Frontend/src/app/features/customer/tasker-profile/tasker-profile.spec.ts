import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerProfile } from './tasker-profile';

describe('TaskerProfile', () => {
  let component: TaskerProfile;
  let fixture: ComponentFixture<TaskerProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
