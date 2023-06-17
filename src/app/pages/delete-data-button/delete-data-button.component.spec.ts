import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDataButtonComponent } from './delete-data-button.component';

describe('DeleteDataButtonComponent', () => {
  let component: DeleteDataButtonComponent;
  let fixture: ComponentFixture<DeleteDataButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDataButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDataButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
