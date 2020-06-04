import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ZoomEditComponent } from './zoom-edit.component';

describe('ZoomEditComponent', () => {
  let component: ZoomEditComponent;
  let fixture: ComponentFixture<ZoomEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ZoomEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ZoomEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
