import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportBitacoraComponent } from './report-bitacora.component';

describe('ReportBitacoraComponent', () => {
  let component: ReportBitacoraComponent;
  let fixture: ComponentFixture<ReportBitacoraComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportBitacoraComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportBitacoraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
