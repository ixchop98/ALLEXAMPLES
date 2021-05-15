import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditVisionComponent } from './edit-vision.component';

describe('EditVisionComponent', () => {
  let component: EditVisionComponent;
  let fixture: ComponentFixture<EditVisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditVisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditVisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
