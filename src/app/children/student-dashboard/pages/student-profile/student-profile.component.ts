import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {IFullInfoModel} from '../../../../data/models/profile/IFullInfo.model';
import {ProfileManagerService} from '../../../../data/services/profile/profile.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormatterService} from '../../../services/formatter/formatter.service';
import {AuthManagerService} from '../../../../data/services/auth/auth.manager.service';

@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile.component.html',
    styleUrls: ['./styles/student-profile.component.css', '../../styles/student-dashboard-styles.css']
})
export class StudentProfileComponent implements OnInit {
    protected isLoading: boolean = true;
    protected infoMe!: IFullInfoModel | null;
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _profileManagerService: ProfileManagerService = inject(ProfileManagerService);
    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);

    public ngOnInit(): void {
        this.getInfoMe();
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

                this.timeout(1500);
            }
        })
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
    }
}
