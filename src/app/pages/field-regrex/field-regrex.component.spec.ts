import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FieldRegrexComponent } from './field-regrex.component';

describe('FieldRegrexComponent', () => {
  let component: FieldRegrexComponent;
  let fixture: ComponentFixture<FieldRegrexComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FieldRegrexComponent]
    });
    fixture = TestBed.createComponent(FieldRegrexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
