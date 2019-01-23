import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CofirmModalComponent } from './cofirm-modal.component';

describe('CofirmModalComponent', () => {
  let component: CofirmModalComponent;
  let fixture: ComponentFixture<CofirmModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CofirmModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CofirmModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
