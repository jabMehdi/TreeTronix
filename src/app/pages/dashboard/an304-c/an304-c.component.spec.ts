import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AN304CComponent } from './an304-c.component';

describe('AN304CComponent', () => {
  let component: AN304CComponent;
  let fixture: ComponentFixture<AN304CComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AN304CComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AN304CComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
