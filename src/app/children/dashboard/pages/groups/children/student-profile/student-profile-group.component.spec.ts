import {ComponentFixture, TestBed} from '@angular/core/testing';

import {StudentProfileGroupComponent} from './student-profile-group.component';

describe('StudentProfileComponent', () => {
    let component: StudentProfileGroupComponent;
    let fixture: ComponentFixture<StudentProfileGroupComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [StudentProfileGroupComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(StudentProfileGroupComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
