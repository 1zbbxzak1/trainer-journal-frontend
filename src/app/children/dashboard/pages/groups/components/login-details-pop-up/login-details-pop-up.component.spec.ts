import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginDetailsPopUpComponent } from './login-details-pop-up.component';

describe('LoginDetailsPopUpComponent', () => {
  let component: LoginDetailsPopUpComponent;
  let fixture: ComponentFixture<LoginDetailsPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginDetailsPopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoginDetailsPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
