import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFailedBookingDetails } from './payment-failed-booking-details';

describe('PaymentFailedBookingDetails', () => {
  let component: PaymentFailedBookingDetails;
  let fixture: ComponentFixture<PaymentFailedBookingDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFailedBookingDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFailedBookingDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
