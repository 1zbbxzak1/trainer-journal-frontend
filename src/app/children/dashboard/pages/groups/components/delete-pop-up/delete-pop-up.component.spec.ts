import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletePopUpComponent } from './delete-pop-up.component';

describe('DeletePopUpComponent', () => {
  let component: DeletePopUpComponent;
  let fixture: ComponentFixture<DeletePopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletePopUpComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeletePopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
