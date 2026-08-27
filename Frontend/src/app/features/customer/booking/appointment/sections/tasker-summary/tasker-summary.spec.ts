import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTaskerSummary } from './tasker-summary';

describe('BookingTaskerSummary', () => {
  let component: BookingTaskerSummary;
  let fixture: ComponentFixture<BookingTaskerSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingTaskerSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingTaskerSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
