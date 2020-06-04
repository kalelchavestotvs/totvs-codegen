import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RelationAddComponent } from './relation-add.component';

describe('RelationAddComponent', () => {
  let component: RelationAddComponent;
  let fixture: ComponentFixture<RelationAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RelationAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RelationAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
