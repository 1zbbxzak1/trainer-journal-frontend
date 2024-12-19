import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IGetGroupResponseModel} from '../../../../data/response-models/groups/IGetGroup.response-model';
import {Router} from '@angular/router';
import {GroupsManagerService} from '../../../../data/services/groups/groups.manager.service';

@Component({
    selector: 'app-journal',
    standalone: false,

    templateUrl: './journal.component.html',
    styleUrls: ['./styles/journal.component.css', '../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalComponent {
    protected groups: IGetGroupResponseModel | null = null;

    protected readonly _router: Router = inject(Router);
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly _groupsManagerService: GroupsManagerService = inject(GroupsManagerService);

    constructor() {
        this.getAllGroups();
    }

    protected getAllGroups(): void {
        this._groupsManagerService.getAllGroups().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (groups: IGetGroupResponseModel | null): void => {
                this.groups = groups;

                this._cdr.detectChanges();
            },
        });
    }

    protected navigateToJournalDetails(groupId: string): void {
        this._router.navigate(['dashboard/journal/journal-details/', groupId])
    }
}
