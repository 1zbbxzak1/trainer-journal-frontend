import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PracticeCreateComponent } from './practice-create.component';

describe('PracticeCreateComponent', () => {
  let component: PracticeCreateComponent;
  let fixture: ComponentFixture<PracticeCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PracticeCreateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PracticeCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
