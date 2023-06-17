import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddsensorComponent } from './addsensor.component';

describe('AddsensorComponent', () => {
  let component: AddsensorComponent;
  let fixture: ComponentFixture<AddsensorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddsensorComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddsensorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
