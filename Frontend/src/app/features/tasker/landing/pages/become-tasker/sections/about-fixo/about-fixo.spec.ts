import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AboutFixo } from './about-fixo';

describe('AboutFixo', () => {
  let component: AboutFixo;
  let fixture: ComponentFixture<AboutFixo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AboutFixo],
    }).compileComponents();

    fixture = TestBed.createComponent(AboutFixo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
