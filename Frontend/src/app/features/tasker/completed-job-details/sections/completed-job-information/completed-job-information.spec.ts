import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CompletedJobInformation } from './completed-job-information';
describe('CompletedJobInformation', () => { let component: CompletedJobInformation; let fixture: ComponentFixture<CompletedJobInformation>; beforeEach(async () => { await TestBed.configureTestingModule({ imports: [CompletedJobInformation] }).compileComponents(); fixture = TestBed.createComponent(CompletedJobInformation); component = fixture.componentInstance; await fixture.whenStable(); }); it('should create', () => expect(component).toBeTruthy()); });
