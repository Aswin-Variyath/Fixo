import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminResetPassword } from './admin-reset-password';

describe('AdminResetPassword', () => {
  let component: AdminResetPassword;
  let fixture: ComponentFixture<AdminResetPassword>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminResetPassword],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminResetPassword);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
