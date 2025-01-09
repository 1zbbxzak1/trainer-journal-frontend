import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeInfoComponent } from './practice-info.component';

describe('PracticeInfoComponent', () => {
  let component: PracticeInfoComponent;
  let fixture: ComponentFixture<PracticeInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticeInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
