import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyModal } from './policy-modal';

describe('PolicyModal', () => {
  let component: PolicyModal;
  let fixture: ComponentFixture<PolicyModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PolicyModal],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
