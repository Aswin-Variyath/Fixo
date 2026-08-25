import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BecomeATasker } from './become-a-tasker';

describe('BecomeATasker', () => {
  let component: BecomeATasker;
  let fixture: ComponentFixture<BecomeATasker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BecomeATasker],
    }).compileComponents();

    fixture = TestBed.createComponent(BecomeATasker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
