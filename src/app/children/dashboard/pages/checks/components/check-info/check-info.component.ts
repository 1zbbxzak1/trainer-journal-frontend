import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {ChecksManagerService} from '../../../../../../data/services/checks/checks.manager.service';
import {
    IPaymentReceiptResponseModel
} from '../../../../../../data/response-models/checks/IPaymentReceipt.response-model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    IVerifyPaymentReceiptRequestModel
} from '../../../../../../data/request-models/checks/IVerifyPaymentReceipt.request-model';
import {FormatterService} from '../../../../../services/formatter/formatter.service';

@Component({
    selector: 'app-check-info',
    templateUrl: './check-info.component.html',
    styleUrl: './styles/check-info.component.css'
})
export class CheckInfoComponent implements OnChanges {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public id: string = '';
    @Input()
    public amount: number = 0;
    @Output()
    public visibleEdit: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public visibleDecline: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();

    protected checkInfo: IPaymentReceiptResponseModel | null = null;
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _checksManagerService: ChecksManagerService = inject(ChecksManagerService);

    public ngOnChanges(): void {
        this.getReceiptById(this.id);
    }

    public refreshData(id: string, amount: number): void {
        this.getReceiptById(id);
        this.amount = amount;
        this._cdr.detectChanges();
    }

    protected closeModal(): void {
        this.close.emit();
    }

    protected editModal(): void {
        this.visibleEdit.emit();
    }

    protected declineModal(): void {
        this.visibleDecline.emit();
    }

    protected confirm(): void {
        const data: IVerifyPaymentReceiptRequestModel = {
            isAccepted: true,
            declineComment: '',
        }

        this.verifyReceipt(this.id, data);

        this.confirmAction.emit();
        this.closeModal();
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

    private getReceiptById(id: string): void {
        this._checksManagerService.getReceiptById(id).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: (receipt: IPaymentReceiptResponseModel): void => {
                this.checkInfo = receipt;

                this._cdr.detectChanges();
            }
        });
    }

    private verifyReceipt(id: string, data: IVerifyPaymentReceiptRequestModel): void {
        this._checksManagerService.verifyReceipt(id, data).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe();
    }
}
