import {DestroyRef, inject, Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Injectable()
export class StateBarService {
    public readonly _router: Router = inject(Router);
    public readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected statesSidebar: Record<string, boolean> = {
        isScheduleClicked: false,
        isGroupsClicked: false,
        isJournalClicked: false,
        isStudentsClicked: false,
        isChecksClicked: false,
        isProfileClicked: false
    };

    constructor() {
        this.initStatesSidebar();
        this._router.events.pipe(
            filter(event => event instanceof NavigationEnd),
            takeUntilDestroyed(this._destroyRef)
        )
            .subscribe((): void => {
                this.initStatesSidebar();
            });
    }

    private initStatesSidebar(): void {
        const url: string = this._router.url;
        this.resetStates(this.statesSidebar);
        if (url.includes('dashboard/schedule')) {
            this.statesSidebar['isScheduleClicked'] = true;
        } else if (url.includes('dashboard/groups')) {
            this.statesSidebar['isGroupsClicked'] = true;
        } else if (url.includes('dashboard/journal')) {
            this.statesSidebar['isJournalClicked'] = true;
        } else if (url.includes('dashboard/students')) {
            this.statesSidebar['isStudentsClicked'] = true;
        } else if (url.includes('dashboard/checks')) {
            this.statesSidebar['isChecksClicked'] = true;
        } else if (url.includes('dashboard/profile')) {
            this.statesSidebar['isProfileClicked'] = true;
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
