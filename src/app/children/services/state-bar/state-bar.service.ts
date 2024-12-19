import {DestroyRef, inject, Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable()
export class StateBarService {
    public readonly _router: Router = inject(Router);
    public readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected statesSidebarTrainer: Record<string, boolean> = {
        isScheduleClicked: false,
        isGroupsClicked: false,
        isJournalClicked: false,
        isStudentsClicked: false,
        isChecksClicked: false,
        isProfileClicked: false
    };

    protected statesSidebarUser: Record<string, boolean> = {
        isScheduleClicked: false,
        isGroupsClicked: false,
        isChecksClicked: false,
        isProfileClicked: false
    };

    constructor() {
        this.initStatesSidebar();
        this.initStatesSidebarUser();

        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntilDestroyed(this._destroyRef)
        )
            .subscribe((): void => {
                this.initStatesSidebar();
                this.initStatesSidebarUser();
            });
    }

    private initStatesSidebar(): void {
        const url: string = this._router.url;
        this.resetStates(this.statesSidebarTrainer);
        if (url.includes('dashboard/schedule')) {
            this.statesSidebarTrainer['isScheduleClicked'] = true;
        } else if (url.includes('dashboard/groups')) {
            this.statesSidebarTrainer['isGroupsClicked'] = true;
        } else if (url.includes('dashboard/journal')) {
            this.statesSidebarTrainer['isJournalClicked'] = true;
        } else if (url.includes('dashboard/students')) {
            this.statesSidebarTrainer['isStudentsClicked'] = true;
        } else if (url.includes('dashboard/checks')) {
            this.statesSidebarTrainer['isChecksClicked'] = true;
        } else if (url.includes('dashboard/profile')) {
            this.statesSidebarTrainer['isProfileClicked'] = true;
        }
    }

    private initStatesSidebarUser(): void {
        const url: string = this._router.url;
        this.resetStates(this.statesSidebarUser);
        if (url.includes('student-dashboard/schedule')) {
            this.statesSidebarUser['isScheduleClicked'] = true;
        } else if (url.includes('student-dashboard/groups')) {
            this.statesSidebarUser['isGroupsClicked'] = true;
        } else if (url.includes('student-dashboard/checks')) {
            this.statesSidebarUser['isChecksClicked'] = true;
        } else if (url.includes('student-dashboard/profile')) {
            this.statesSidebarUser['isProfileClicked'] = true;
        }
    }

    private resetStates(state: Record<string, boolean>): void {
        for (const key in state) {
            if (Object.prototype.hasOwnProperty.call(state, key)) {
                state[key] = false;
            }
        }
    }
}
