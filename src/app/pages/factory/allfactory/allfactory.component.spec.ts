import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AllfactoryComponent } from './allfactory.component';

describe('AllfactoryComponent', () => {
  let component: AllfactoryComponent;
  let fixture: ComponentFixture<AllfactoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AllfactoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AllfactoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
