import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecodersComponent } from './decoders.component';

describe('DecodersComponent', () => {
  let component: DecodersComponent;
  let fixture: ComponentFixture<DecodersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecodersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecodersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
