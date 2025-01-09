import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {ProfileManagerService} from '../../../../data/services/profile/profile.manager.service';
import {IFullInfoModel} from '../../../../data/models/profile/IFullInfo.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {AuthManagerService} from '../../../../data/services/auth/auth.manager.service';
import {FormatterService} from '../../../services/formatter/formatter.service';

@Component({
    selector: 'app-profile',
    standalone: false,
    templateUrl: './profile.component.html',
    styleUrls: ['./styles/profile.component.css', '../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProfileComponent implements OnInit {
    protected infoMe!: IFullInfoModel | null;
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _profileManagerService: ProfileManagerService = inject(ProfileManagerService);
    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);

    public ngOnInit(): void {
        this.getInfoMe();
    }

    protected deleteCookie(): void {
        this._authManagerService.logout();
        this._cdr.detectChanges();
    }

    private getInfoMe(): void {
        this._profileManagerService.getInfoMe().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (profile: IFullInfoModel | null): void => {
                this.infoMe = profile;

                this._cdr.detectChanges();
            }
        })
    }
}
