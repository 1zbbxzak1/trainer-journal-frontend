import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ProfileManagerService} from '../../../../data/services/profile/profile.manager.service';
import {IFullInfoModel} from '../../../../data/models/profile/IFullInfo.model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

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
    private readonly _router: Router = inject(Router);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _profileManagerService: ProfileManagerService = inject(ProfileManagerService);

    public ngOnInit(): void {
        this.getInfoMe();
    }

    protected removeCookies(): void {
        this.deleteCookie('accessToken');
        this.deleteCookie('loginTimestamp');
        this._router.navigate(['/']).then((): void => {
            this._cdr.detectChanges();
        });
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

    private deleteCookie(cookieName: string): void {
        document.cookie = `${cookieName}=;`;
    }
}
