import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSignin } from './admin-signin';

describe('AdminSignin', () => {
  let component: AdminSignin;
  let fixture: ComponentFixture<AdminSignin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminSignin],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminSignin);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
