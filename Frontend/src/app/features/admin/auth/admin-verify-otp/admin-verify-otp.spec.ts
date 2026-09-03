import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminVerifyOtp } from './admin-verify-otp';

describe('AdminVerifyOtp', () => {
  let component: AdminVerifyOtp;
  let fixture: ComponentFixture<AdminVerifyOtp>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminVerifyOtp],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminVerifyOtp);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
