import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SendCheckComponent } from './send-check.component';

describe('SendCheckComponent', () => {
  let component: SendCheckComponent;
  let fixture: ComponentFixture<SendCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SendCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SendCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
