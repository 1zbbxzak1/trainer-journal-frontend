import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckInfoComponent } from './check-info.component';

describe('CheckInfoComponent', () => {
  let component: CheckInfoComponent;
  let fixture: ComponentFixture<CheckInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CheckInfoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CheckInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
