import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerVisibilityBanner } from './tasker-visibility-banner';

describe('TaskerVisibilityBanner', () => {
  let component: TaskerVisibilityBanner;
  let fixture: ComponentFixture<TaskerVisibilityBanner>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerVisibilityBanner],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerVisibilityBanner);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
