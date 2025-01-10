import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {IFullInfoModel} from '../../../../data/models/profile/IFullInfo.model';
import {ProfileManagerService} from '../../../../data/services/profile/profile.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {StudentsManagerService} from '../../../../data/services/students/students.manager.service';
import {IBalanceChangeResponseModel} from '../../../../data/response-models/students/IBalanceChange.response-model';
import {ChecksManagerService} from '../../../../data/services/checks/checks.manager.service';
import {IPaymentReceiptResponseModel} from '../../../../data/response-models/checks/IPaymentReceipt.response-model';
import {FormatterService} from '../../../services/formatter/formatter.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-student-checks',
    templateUrl: './student-checks.component.html',
    styleUrls: ['./styles/student-checks.component.css', '../../styles/student-dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentChecksComponent implements OnInit {
    protected infoMe!: IFullInfoModel | null;
    protected balanceReport: IBalanceChangeResponseModel | null = null;
    protected checks: IPaymentReceiptResponseModel[] | null = null;
    protected id: string = '';
    protected amount: number = 0;
    protected isModalVisible: boolean = false;
    protected isModalInfoVisible: boolean = false;

    protected modalFormGroup: FormGroup;

    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly formatter: FormatterService = inject(FormatterService);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _profileManagerService: ProfileManagerService = inject(ProfileManagerService);
    private readonly _studentsManagerService: StudentsManagerService = inject(StudentsManagerService);
    private readonly _checksManagerService: ChecksManagerService = inject(ChecksManagerService);

    constructor(private _fb: FormBuilder) {
        this.modalFormGroup = this._fb.group({
            file: [null, Validators.required],
            amount: [null, [Validators.required, Validators.min(1)]],
        });
    }

    public ngOnInit(): void {
        this.getInfoMe();
    }

    protected openModal(): void {
        this.isModalVisible = true;
    }

    protected closeModal(): void {
        this.isModalVisible = false;
    }

    protected openModalInfo(id: string, amount: number): void {
        this.isModalInfoVisible = true;
        this.id = id;
        this.amount = amount;
    }

    protected closeModalInfo(): void {
        this.isModalInfoVisible = false;
        this.id = '';
    }

    protected uploadReceipt(): void {
        if (this.modalFormGroup.valid) {
            const formData: FormData = new FormData();
            formData.append('file', this.modalFormGroup.value.file);
            formData.append('Amount', this.modalFormGroup.value.amount);

            this._checksManagerService.uploadReceipt(formData).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.closeModal();
                    this.refreshReceipts();
                }
            });
        }
    }


    protected getBackgroundStatus(check: IPaymentReceiptResponseModel, status: boolean): string {
        if (check.isVerified && !status) {
            return "#FFEBEB";
        } else if (check.isVerified && status) {
            return "#C7F9CC";
        } else if (!check.isVerified && !status) {
            return "#FFEEC2";
        } else {
            return '';
        }
    }

    protected getTitleStatus(check: IPaymentReceiptResponseModel, status: boolean): string {
        if (check.isVerified && !status) {
            return "Отклонен";
        } else if (check.isVerified && status) {
            return "Принят";
        } else if (!check.isVerified && !status) {
            return "На проверке";
        } else {
            return '';
        }
    }

    protected getTitleStatusStyle(check: IPaymentReceiptResponseModel, status: boolean): string {
        if (check.isVerified && !status) {
            return "#f93232";
        } else if (check.isVerified && status) {
            return "#439f6e";
        } else if (!check.isVerified && !status) {
            return "#fcb73e";
        } else {
            return '';
        }
    }

    private refreshReceipts(): void {
        if (this.infoMe) {
            this.getReceipts(this.infoMe.username, null);
        }
    }

    private getInfoMe(): void {
        this._profileManagerService.getInfoMe().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (profile: IFullInfoModel | null): void => {
                this.infoMe = profile;

                this._cdr.detectChanges();

                this.getBalanceChangeReport(profile!.username);

                this.getReceipts(profile!.username, null);
            }
        })
    }

    private getBalanceChangeReport(username: string): void {
        this._studentsManagerService.getCurrentMonthBalanceChangesReport(username).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (report: IBalanceChangeResponseModel): void => {
                this.balanceReport = report;

                this._cdr.detectChanges();
            }
        })
    }

    private getReceipts(username: string, verified: boolean | null): void {
        this._checksManagerService.getReceiptByUsername(username, verified).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (receipts: IPaymentReceiptResponseModel[]): void => {
                this.checks = receipts;

                this._cdr.detectChanges();
            }
        })
    }
}
