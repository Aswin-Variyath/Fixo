import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationActions } from './confirmation-actions';

describe('ConfirmationActions', () => {
  let component: ConfirmationActions;
  let fixture: ComponentFixture<ConfirmationActions>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationActions],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationActions);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
