import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportUserAccessComponent } from './report-user-access.component';

describe('ReportUserAccessComponent', () => {
  let component: ReportUserAccessComponent;
  let fixture: ComponentFixture<ReportUserAccessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportUserAccessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportUserAccessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
