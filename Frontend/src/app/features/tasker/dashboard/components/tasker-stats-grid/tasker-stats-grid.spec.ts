import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerStatsGrid } from './tasker-stats-grid';

describe('TaskerStatsGrid', () => {
  let component: TaskerStatsGrid;
  let fixture: ComponentFixture<TaskerStatsGrid>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerStatsGrid],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerStatsGrid);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
