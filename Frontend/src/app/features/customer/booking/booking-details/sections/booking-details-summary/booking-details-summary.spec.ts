import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingDetailsSummary } from './booking-details-summary';

describe('BookingDetailsSummary', () => {
  let component: BookingDetailsSummary;
  let fixture: ComponentFixture<BookingDetailsSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingDetailsSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingDetailsSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
