import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFailedActions } from './payment-failed-actions';

describe('PaymentFailedActions', () => {
  let component: PaymentFailedActions;
  let fixture: ComponentFixture<PaymentFailedActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFailedActions],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFailedActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
