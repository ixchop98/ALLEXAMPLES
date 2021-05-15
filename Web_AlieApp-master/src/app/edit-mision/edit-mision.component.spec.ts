import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMisionComponent } from './edit-mision.component';

describe('EditMisionComponent', () => {
  let component: EditMisionComponent;
  let fixture: ComponentFixture<EditMisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditMisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditMisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
