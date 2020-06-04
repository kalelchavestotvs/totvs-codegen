import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnumEditComponent } from './enum-edit.component';

describe('EnumEditComponent', () => {
  let component: EnumEditComponent;
  let fixture: ComponentFixture<EnumEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnumEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnumEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
