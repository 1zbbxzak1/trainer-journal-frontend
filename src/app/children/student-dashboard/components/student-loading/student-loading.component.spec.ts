import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentLoadingComponent } from './student-loading.component';

describe('StudentLoadingComponent', () => {
  let component: StudentLoadingComponent;
  let fixture: ComponentFixture<StudentLoadingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StudentLoadingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentLoadingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
