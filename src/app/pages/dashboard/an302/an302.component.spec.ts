import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AN302Component } from './an302.component';

describe('AN302Component', () => {
  let component: AN302Component;
  let fixture: ComponentFixture<AN302Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AN302Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AN302Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
