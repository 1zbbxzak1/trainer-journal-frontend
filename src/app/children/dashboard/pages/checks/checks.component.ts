import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject} from '@angular/core';
import {IGetGroupResponseModel} from '../../../../data/response-models/groups/IGetGroup.response-model';
import {Router} from '@angular/router';
import {GroupsManagerService} from '../../../../data/services/groups/groups.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-checks',
    standalone: false,

    templateUrl: './checks.component.html',
    styleUrls: ['./styles/checks.component.css', '../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecksComponent {
    protected groups: IGetGroupResponseModel | null = null;
    protected isLoading: boolean = true;

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

                this.timeout(1500);
            },
            error: (): void => {
                this.timeout(1500);
            }
        });
    }

    protected navigateToChecksDetails(groupId: string): void {
        this._router.navigate(['dashboard/checks/checks-details/', groupId])
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
    }
}
