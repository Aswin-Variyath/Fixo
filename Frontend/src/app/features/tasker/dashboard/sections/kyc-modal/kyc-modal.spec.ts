import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KycModal } from './kyc-modal';

describe('KycModal', () => {
  let component: KycModal;
  let fixture: ComponentFixture<KycModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KycModal],
    }).compileComponents();

    fixture = TestBed.createComponent(KycModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
