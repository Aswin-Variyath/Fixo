import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmationHeader } from './confirmation-header';

describe('ConfirmationHeader', () => {
  let component: ConfirmationHeader;
  let fixture: ComponentFixture<ConfirmationHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfirmationHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(ConfirmationHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
