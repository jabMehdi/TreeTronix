import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SDevicesComponent } from './s-devices.component';

describe('SDevicesComponent', () => {
  let component: SDevicesComponent;
  let fixture: ComponentFixture<SDevicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SDevicesComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SDevicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
