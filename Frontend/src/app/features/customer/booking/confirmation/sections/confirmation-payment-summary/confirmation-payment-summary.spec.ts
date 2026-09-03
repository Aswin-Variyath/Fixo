import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationPaymentSummary } from './confirmation-payment-summary';

describe('ConfirmationPaymentSummary', () => {
  let component: ConfirmationPaymentSummary;
  let fixture: ComponentFixture<ConfirmationPaymentSummary>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationPaymentSummary],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationPaymentSummary);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
