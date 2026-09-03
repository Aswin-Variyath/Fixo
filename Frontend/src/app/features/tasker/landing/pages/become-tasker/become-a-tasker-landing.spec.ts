import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeTaskerLanding } from './become-a-tasker-landing';

describe('BecomeTasker', () => {
  let component: BecomeTaskerLanding;
  let fixture: ComponentFixture<BecomeTaskerLanding>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeTaskerLanding],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeTaskerLanding);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
