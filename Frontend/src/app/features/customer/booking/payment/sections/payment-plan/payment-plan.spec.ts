import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPlanSection } from './payment-plan';

describe('PaymentPlanSection', () => {
  let component: PaymentPlanSection;
  let fixture: ComponentFixture<PaymentPlanSection>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentPlanSection],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentPlanSection);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
