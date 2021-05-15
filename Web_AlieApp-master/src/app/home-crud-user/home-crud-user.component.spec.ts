import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeCrudUserComponent } from './home-crud-user.component';

describe('HomeCrudUserComponent', () => {
  let component: HomeCrudUserComponent;
  let fixture: ComponentFixture<HomeCrudUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HomeCrudUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeCrudUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
