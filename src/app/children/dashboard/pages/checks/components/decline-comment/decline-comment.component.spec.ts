import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeclineCommentComponent } from './decline-comment.component';

describe('DeclineCommentComponent', () => {
  let component: DeclineCommentComponent;
  let fixture: ComponentFixture<DeclineCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeclineCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeclineCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
