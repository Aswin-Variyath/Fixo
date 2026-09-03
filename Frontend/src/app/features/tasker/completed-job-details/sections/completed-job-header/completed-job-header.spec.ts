import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedJobHeader } from './completed-job-header';

describe('CompletedJobHeader', () => {
  let component: CompletedJobHeader;
  let fixture: ComponentFixture<CompletedJobHeader>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [CompletedJobHeader] }).compileComponents();
    fixture = TestBed.createComponent(CompletedJobHeader);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => expect(component).toBeTruthy());
});
