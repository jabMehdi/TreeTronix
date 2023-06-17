import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AN103AComponent } from './an103-a.component';

describe('AN103AComponent', () => {
  let component: AN103AComponent;
  let fixture: ComponentFixture<AN103AComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AN103AComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AN103AComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
