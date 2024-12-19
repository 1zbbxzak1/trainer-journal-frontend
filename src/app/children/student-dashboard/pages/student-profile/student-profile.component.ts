import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {IFullInfoModel} from '../../../../data/models/profile/IFullInfo.model';
import {Router} from '@angular/router';
import {ProfileManagerService} from '../../../../data/services/profile/profile.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormatterService} from '../../../services/formatter/formatter.service';

@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile.component.html',
    styleUrls: ['./styles/student-profile.component.css', '../../styles/student-dashboard-styles.css']
})
export class StudentProfileComponent implements OnInit {
    protected infoMe!: IFullInfoModel | null;
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _formatter: FormatterService = inject(FormatterService);
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

    protected getColorForBalance(balance: number): string {
        if (balance < 0) {
            return "#f93232";
        } else {
            return "#439f6e";
        }
    }

    protected getGender(gender: string): string {
        if (gender === 'М') {
            return 'Мужской';
        } else {
            return 'Женский';
        }
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
