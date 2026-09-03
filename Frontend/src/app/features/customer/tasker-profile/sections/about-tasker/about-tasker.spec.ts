import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutTasker } from './about-tasker';

describe('AboutTasker', () => {
  let component: AboutTasker;
  let fixture: ComponentFixture<AboutTasker>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutTasker],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutTasker);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
