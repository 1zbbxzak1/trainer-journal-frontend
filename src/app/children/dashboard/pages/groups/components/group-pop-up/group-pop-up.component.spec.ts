import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GroupPopUpComponent} from './group-pop-up.component';

describe('CreateGroupPopUpComponent', () => {
    let component: GroupPopUpComponent;
    let fixture: ComponentFixture<GroupPopUpComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            declarations: [GroupPopUpComponent]
        })
            .compileComponents();

        fixture = TestBed.createComponent(GroupPopUpComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
