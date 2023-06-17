import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { An103AComponent } from './an103-a.component';

describe('An103AComponent', () => {
  let component: An103AComponent;
  let fixture: ComponentFixture<An103AComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ An103AComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(An103AComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
