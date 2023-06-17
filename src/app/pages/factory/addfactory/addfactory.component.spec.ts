import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddfactoryComponent } from './addfactory.component';

describe('AddfactoryComponent', () => {
  let component: AddfactoryComponent;
  let fixture: ComponentFixture<AddfactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddfactoryComponent ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddfactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
