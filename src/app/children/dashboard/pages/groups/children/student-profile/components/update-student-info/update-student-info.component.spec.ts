import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateStudentInfoComponent } from './update-student-info.component';

describe('UpdateStudentInfoComponent', () => {
  let component: UpdateStudentInfoComponent;
  let fixture: ComponentFixture<UpdateStudentInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [UpdateStudentInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UpdateStudentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
