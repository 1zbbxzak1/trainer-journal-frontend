import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStudentsPopUpComponent } from './add-students-pop-up.component';

describe('AddStudentsPopUpComponent', () => {
  let component: AddStudentsPopUpComponent;
  let fixture: ComponentFixture<AddStudentsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddStudentsPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddStudentsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
