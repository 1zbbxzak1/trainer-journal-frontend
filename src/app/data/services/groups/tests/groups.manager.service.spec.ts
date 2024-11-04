import {TestBed} from '@angular/core/testing';

import {GroupsManagerService} from '../groups.manager.service';

describe('GroupsManagerService', () => {
    let service: GroupsManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(GroupsManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
