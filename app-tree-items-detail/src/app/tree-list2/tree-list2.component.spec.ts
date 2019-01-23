import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeList2Component } from './tree-list2.component';

describe('TreeList2Component', () => {
  let component: TreeList2Component;
  let fixture: ComponentFixture<TreeList2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TreeList2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeList2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
