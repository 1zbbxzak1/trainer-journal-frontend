import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAmountComponent } from './edit-amount.component';

describe('EditAmountComponent', () => {
  let component: EditAmountComponent;
  let fixture: ComponentFixture<EditAmountComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAmountComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditAmountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
