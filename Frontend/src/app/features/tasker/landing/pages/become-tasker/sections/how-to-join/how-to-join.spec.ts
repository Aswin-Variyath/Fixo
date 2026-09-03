import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HowToJoin } from './how-to-join';

describe('HowToJoin', () => {
  let component: HowToJoin;
  let fixture: ComponentFixture<HowToJoin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HowToJoin],
    }).compileComponents();

    fixture = TestBed.createComponent(HowToJoin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
