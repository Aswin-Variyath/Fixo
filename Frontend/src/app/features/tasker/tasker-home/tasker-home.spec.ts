import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerHome } from './tasker-home';

describe('TaskerHome', () => {
  let component: TaskerHome;
  let fixture: ComponentFixture<TaskerHome>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerHome],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerHome);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
