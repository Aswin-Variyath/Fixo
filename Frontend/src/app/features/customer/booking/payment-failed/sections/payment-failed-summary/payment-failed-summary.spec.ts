import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFailedSummary } from './payment-failed-summary';

describe('PaymentFailedSummary', () => {
  let component: PaymentFailedSummary;
  let fixture: ComponentFixture<PaymentFailedSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFailedSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFailedSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
