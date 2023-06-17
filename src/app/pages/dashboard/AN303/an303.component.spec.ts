import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { An303Component } from './an303.component';

describe('An303Component', () => {
  let component: An303Component;
  let fixture: ComponentFixture<An303Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ An303Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(An303Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
