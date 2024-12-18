import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateStudentPopUpComponent } from './create-student-pop-up.component';

describe('CreateStudentPopUpComponent', () => {
  let component: CreateStudentPopUpComponent;
  let fixture: ComponentFixture<CreateStudentPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CreateStudentPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateStudentPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
