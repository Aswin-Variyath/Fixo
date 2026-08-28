import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TaskerKycModal } from './tasker-kyc-modal';

describe('TaskerKycModal', () => {
  let component: TaskerKycModal;
  let fixture: ComponentFixture<TaskerKycModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskerKycModal],
    }).compileComponents();

    fixture = TestBed.createComponent(TaskerKycModal);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
