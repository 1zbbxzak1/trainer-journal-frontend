import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, ViewChild} from '@angular/core';
import {
    IPaymentReceiptResponseModel
} from '../../../../../../data/response-models/checks/IPaymentReceipt.response-model';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {FormatterService} from '../../../../../services/formatter/formatter.service';
import {ChecksManagerService} from '../../../../../../data/services/checks/checks.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params} from '@angular/router';
import {IGroupResponseModel} from '../../../../../../data/response-models/groups/IGroup.response-model';
import {GroupsManagerService} from '../../../../../../data/services/groups/groups.manager.service';
import {CheckInfoComponent} from '../../components/check-info/check-info.component';
import {
    IVerifyPaymentReceiptRequestModel
} from '../../../../../../data/request-models/checks/IVerifyPaymentReceipt.request-model';

@Component({
    selector: 'app-checks-details',
    standalone: false,

    templateUrl: './checks-details.component.html',
    styleUrls: ['./styles/checks-details.component.css', '../../../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChecksDetailsComponent {
    @ViewChild('checkInfoComponent')
    checkInfoComponent!: CheckInfoComponent;

    protected groupId: string = '';
    protected groupById: IGroupResponseModel | null = null;
    protected isLoading: boolean = true;

    protected search: string = '';
    protected statusSortOrder: 'На проверке' | 'Проверено' | 'Принят' | 'Отклонен' | null = null;

    protected checks: IPaymentReceiptResponseModel[] | null = null;
    protected id: string = '';
    protected amount: number = 0;
    protected isModalInfoVisible: boolean = false;
    protected isModalEditVisible: boolean = false;
    protected isModalCommentVisible: boolean = false;

    protected modalFormGroupInfo: FormGroup;
    protected modalFormGroupEdit: FormGroup;
    protected modalFormGroupComment: FormGroup;

    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly formatter: FormatterService = inject(FormatterService);

    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _groupsManagerService: GroupsManagerService = inject(GroupsManagerService);
    private readonly _checksManagerService: ChecksManagerService = inject(ChecksManagerService);

    constructor(
        private _fb: FormBuilder,
        private readonly _activatedRoute: ActivatedRoute
    ) {
        this._activatedRoute.params.subscribe((params: Params): void => {
            this.groupId = params['id'];

            this.getGroupInfo(this.groupId);
            this.getReceipts(this.groupId);
        });

        this.modalFormGroupEdit = this._fb.group({
            amount: [null, [Validators.required, Validators.min(1)]],
        });

        this.modalFormGroupComment = this._fb.group({
            comment: [null, Validators.required]
        })

        this.modalFormGroupInfo = this._fb.group({
            comment: [null, Validators.required]
        })
    }

    protected searchChecks(): IPaymentReceiptResponseModel[] {
        const filteredChecks: IPaymentReceiptResponseModel[] = this.checks?.filter((check: IPaymentReceiptResponseModel) =>
            check.student.fullName.toLowerCase().includes(this.search.toLowerCase())
        ) || [];

        if (this.statusSortOrder === 'На проверке') {
            filteredChecks.sort((a, b): number => {
                if (a.isVerified === b.isVerified) return 0;
                return a.isVerified ? 1 : -1;
            });
        } else if (this.statusSortOrder === 'Принят') {
            filteredChecks.sort((a, b): number => {
                if (a.isAccepted === b.isAccepted) return 0;
                return a.isAccepted ? -1 : 1;
            });
        } else if (this.statusSortOrder === 'Отклонен') {
            filteredChecks.sort((a, b): number => {
                if (a.isAccepted === b.isAccepted) return 0;
                return a.isAccepted ? -1 : 1;
            });
        }

        return filteredChecks;
    }

    protected toggleStatusSort(): void {
        if (this.statusSortOrder === null) {
            this.statusSortOrder = 'На проверке';
        } else if (this.statusSortOrder === 'На проверке') {
            this.statusSortOrder = 'Принят';
        } else if (this.statusSortOrder === 'Принят') {
            this.statusSortOrder = 'Отклонен';
        } else if (this.statusSortOrder === 'Отклонен') {
            this.statusSortOrder = null;
        }
    }

    protected getStatusSortIcon(): string {
        if (this.statusSortOrder === 'На проверке') {
            return 'assets/chevron-down.svg';
        } else if (this.statusSortOrder === 'Принят') {
            return 'assets/chevron-check.svg';
        } else if (this.statusSortOrder === 'Отклонен') {
            return 'assets/chevron-cross.svg';
        }
        return 'assets/chevron-selector-vertical.svg';
    }

    protected openModalInfo(id: string, amount: number): void {
        this.isModalInfoVisible = true;
        this.id = id;
        this.amount = amount;
    }

    protected closeModalInfo(): void {
        this.getReceipts(this.groupId);
        this.isModalInfoVisible = false;
    }

    protected openModalEdit(): void {
        this.isModalEditVisible = true;

        this.modalFormGroupEdit.patchValue({amount: this.amount});
    }

    protected closeModalEdit(): void {
        this.refreshReceipts(this.groupId);
        this.amount = this.modalFormGroupEdit.value.amount;

        this.refreshData();
        this._cdr.detectChanges();

        this.isModalEditVisible = false;
    }

    protected refreshData(): void {
        this.checkInfoComponent.refreshData(this.id, this.amount);
    }

    protected openModalComment(): void {
        this.isModalCommentVisible = true;
    }

    protected closeModalComment(): void {
        this.getReceipts(this.groupId);
        this.isModalCommentVisible = false;
        this.isModalInfoVisible = false;
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

    protected updateReceipt(id: string): void {
        if (this.modalFormGroupEdit.valid) {
            const formData: FormData = new FormData();
            formData.append('file', '');
            formData.append('Amount', this.modalFormGroupEdit.value.amount);

            this._checksManagerService.updateReceipt(id, formData).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.refreshData();

                    this.closeModalEdit();

                    this.refreshReceipts(this.groupId);
                }
            });
        }
    }

    protected verifyDeclineReceipt(id: string): void {
        const data: IVerifyPaymentReceiptRequestModel = {
            isAccepted: false,
            declineComment: this.modalFormGroupComment.value.comment,
        };

        this._checksManagerService.verifyReceipt(id, data).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe();
    }

    protected refreshReceipts(id: string): void {
        this.getReceipts(id);
    }

    protected getReceipts(id: string): void {
        this._checksManagerService.getReceiptsByGroupId(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (receipts: IPaymentReceiptResponseModel[]): void => {
                this.checks = receipts;

                this.timeout(1500);
            },
            error: (): void => {
                this.timeout(1500);
            }
        })
    }

    private getGroupInfo(id: string): void {
        this._groupsManagerService.getGroupById(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (info: IGroupResponseModel): void => {
                this.groupById = info;

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
