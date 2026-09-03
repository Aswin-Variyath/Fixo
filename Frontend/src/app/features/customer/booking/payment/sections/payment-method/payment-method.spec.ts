import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentMethodSection } from './payment-method';

describe('PaymentMethodSection', () => {
  let component: PaymentMethodSection;
  let fixture: ComponentFixture<PaymentMethodSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentMethodSection],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentMethodSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
