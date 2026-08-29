import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingSummaryCard } from './booking-summary-card';

describe('BookingSummaryCard', () => {
  let component: BookingSummaryCard;
  let fixture: ComponentFixture<BookingSummaryCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingSummaryCard],
    }).compileComponents();

    fixture = TestBed.createComponent(BookingSummaryCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
