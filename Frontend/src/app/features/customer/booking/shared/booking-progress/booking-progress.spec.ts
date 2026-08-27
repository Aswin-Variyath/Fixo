import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingProgress } from './booking-progress';

describe('BookingProgress', () => {
  let component: BookingProgress;
  let fixture: ComponentFixture<BookingProgress>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingProgress],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingProgress);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
