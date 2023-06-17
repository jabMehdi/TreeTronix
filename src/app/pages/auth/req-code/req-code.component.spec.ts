import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReqCodeComponent } from './req-code.component';

describe('ReqCodeComponent', () => {
  let component: ReqCodeComponent;
  let fixture: ComponentFixture<ReqCodeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReqCodeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReqCodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
