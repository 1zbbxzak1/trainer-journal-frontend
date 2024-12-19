import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentChecksComponent } from './student-checks.component';

describe('StudentChecksComponent', () => {
  let component: StudentChecksComponent;
  let fixture: ComponentFixture<StudentChecksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentChecksComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentChecksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
