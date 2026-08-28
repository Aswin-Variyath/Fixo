import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerAvailabilityCard } from './tasker-availability-card';

describe('TaskerAvailabilityCard', () => {
  let component: TaskerAvailabilityCard;
  let fixture: ComponentFixture<TaskerAvailabilityCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerAvailabilityCard],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerAvailabilityCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
