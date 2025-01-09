import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InfoCheckComponent } from './info-check.component';

describe('InfoCheckComponent', () => {
  let component: InfoCheckComponent;
  let fixture: ComponentFixture<InfoCheckComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoCheckComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InfoCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
