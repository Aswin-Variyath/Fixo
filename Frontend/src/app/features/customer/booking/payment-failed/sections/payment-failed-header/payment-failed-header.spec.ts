import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentFailedHeader } from './payment-failed-header';

describe('PaymentFailedHeader', () => {
  let component: PaymentFailedHeader;
  let fixture: ComponentFixture<PaymentFailedHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentFailedHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentFailedHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
