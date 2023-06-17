import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecodeButtonComponent } from './decode-button.component';

describe('DecodeButtonComponent', () => {
  let component: DecodeButtonComponent;
  let fixture: ComponentFixture<DecodeButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DecodeButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DecodeButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
