import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {IFullInfoModel} from '../../../../../../data/models/profile/IFullInfo.model';
import {FormatterService} from '../../../../../services/formatter/formatter.service';
import {ProfileManagerService} from '../../../../../../data/services/profile/profile.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile-group.component.html',
    styleUrls: ['./styles/student-profile-group.component.css', '../../../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentProfileGroupComponent implements OnInit {
    protected isLoading: boolean = true;
    protected infoUser!: IFullInfoModel | null;
    protected kyu: string | null = null;
    protected readonly _formatter: FormatterService = inject(FormatterService);
    protected isVisible: boolean = false;
    protected username: string = '';
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _profileManagerService: ProfileManagerService = inject(ProfileManagerService);

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
    ) {
    }

    public ngOnInit(): void {
        this._activatedRoute.params.subscribe((params: Params): void => {
            this.username = params['username'];

            this.getInfoUser(this.username);
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

    protected openModal(): void {
        this.isVisible = true;
    }

    protected closeModal(): void {
        this.getInfoUser(this.username);
        this._cdr.detectChanges();
        this.isVisible = false;
    }

    private getInfoUser(username: string): void {
        this._profileManagerService.getInfoUser(username).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (user: IFullInfoModel | null): void => {
                this.infoUser = user;

                if (this.infoUser?.studentInfo?.kyu === null) {
                    this.kyu = '';
                } else {
                    this.kyu = ', ' + this.infoUser!.studentInfo!.kyu!.toString() + ' кю';
                }

                this.timeout(1500);
            },
            error: (): void => {
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
