import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EarningsOverview } from './earnings-overview';
describe('EarningsOverview', () => { let component: EarningsOverview; let fixture: ComponentFixture<EarningsOverview>; beforeEach(async () => { await TestBed.configureTestingModule({ imports: [EarningsOverview] }).compileComponents(); fixture = TestBed.createComponent(EarningsOverview); component = fixture.componentInstance; await fixture.whenStable(); }); it('should create', () => expect(component).toBeTruthy()); });
