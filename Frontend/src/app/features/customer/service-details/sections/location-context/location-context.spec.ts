import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationContext } from './location-context';

describe('LocationContext', () => {
  let component: LocationContext;
  let fixture: ComponentFixture<LocationContext>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [LocationContext] }).compileComponents();
    fixture = TestBed.createComponent(LocationContext);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
