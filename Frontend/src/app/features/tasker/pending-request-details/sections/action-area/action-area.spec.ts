import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActionArea } from './action-area';

describe('ActionArea', () => {
  let component: ActionArea;
  let fixture: ComponentFixture<ActionArea>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ActionArea],
    }).compileComponents();

    fixture = TestBed.createComponent(ActionArea);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
