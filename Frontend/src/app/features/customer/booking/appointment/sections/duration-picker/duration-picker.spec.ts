import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DurationPicker } from './duration-picker';

describe('DurationPicker', () => {
  let component: DurationPicker;
  let fixture: ComponentFixture<DurationPicker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DurationPicker],
    }).compileComponents();

    fixture = TestBed.createComponent(DurationPicker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
