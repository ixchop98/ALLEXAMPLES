import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportTreeComponent } from './report-tree.component';

describe('ReportTreeComponent', () => {
  let component: ReportTreeComponent;
  let fixture: ComponentFixture<ReportTreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportTreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportTreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
