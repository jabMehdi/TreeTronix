import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AN301Component } from './an301.component';

describe('AN301Component', () => {
  let component: AN301Component;
  let fixture: ComponentFixture<AN301Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AN301Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AN301Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
