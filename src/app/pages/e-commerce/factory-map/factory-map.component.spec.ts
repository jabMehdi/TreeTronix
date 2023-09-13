import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Factory } from './mapbox.component';
import { FactoryMapComponent } from './factory-map.component';

describe('MapboxComponent', () => {
  let component: FactoryMapComponent;
  let fixture: ComponentFixture<FactoryMapComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FactoryMapComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FactoryMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
