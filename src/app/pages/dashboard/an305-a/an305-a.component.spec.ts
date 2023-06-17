import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AN305AComponent } from './an305-a.component';

describe('AN305AComponent', () => {
  let component: AN305AComponent;
  let fixture: ComponentFixture<AN305AComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AN305AComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AN305AComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
