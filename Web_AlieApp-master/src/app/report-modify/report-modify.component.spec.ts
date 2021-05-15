import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportModifyComponent } from './report-modify.component';

describe('ReportModifyComponent', () => {
  let component: ReportModifyComponent;
  let fixture: ComponentFixture<ReportModifyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportModifyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportModifyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
