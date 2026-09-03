import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhyChoodeFixo } from './why-choode-fixo';

describe('WhyChoodeFixo', () => {
  let component: WhyChoodeFixo;
  let fixture: ComponentFixture<WhyChoodeFixo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhyChoodeFixo],
    }).compileComponents();

    fixture = TestBed.createComponent(WhyChoodeFixo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
