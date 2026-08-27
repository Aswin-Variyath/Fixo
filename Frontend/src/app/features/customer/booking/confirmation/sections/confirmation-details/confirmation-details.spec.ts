import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationDetails } from './confirmation-details';

describe('ConfirmationDetails', () => {
  let component: ConfirmationDetails;
  let fixture: ComponentFixture<ConfirmationDetails>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationDetails],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationDetails);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
