import {TestBed} from '@angular/core/testing';

import {AuthManagerService} from '../auth.manager.service';

describe('AuthManagerService', () => {
    let service: AuthManagerService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(AuthManagerService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
