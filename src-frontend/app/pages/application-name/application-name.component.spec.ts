import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicationNameComponent } from './application-name.component';

describe('ApplicationNameComponent', () => {
  let component: ApplicationNameComponent;
  let fixture: ComponentFixture<ApplicationNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApplicationNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApplicationNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
