import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeAttendanceComponent } from './practice-attendance.component';

describe('PracticeAttendanceComponent', () => {
  let component: PracticeAttendanceComponent;
  let fixture: ComponentFixture<PracticeAttendanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticeAttendanceComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeAttendanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
