import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscoveryHeader } from './discovery-header';

describe('DiscoveryHeader', () => {
  let component: DiscoveryHeader;
  let fixture: ComponentFixture<DiscoveryHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DiscoveryHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(DiscoveryHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
