import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JournalDetailsComponent } from './journal-details.component';

describe('JournalDetailsComponent', () => {
  let component: JournalDetailsComponent;
  let fixture: ComponentFixture<JournalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [JournalDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JournalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
