import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {
    IPaymentReceiptResponseModel
} from '../../../../../../data/response-models/checks/IPaymentReceipt.response-model';
import {FormatterService} from '../../../../../services/formatter/formatter.service';
import {ChecksManagerService} from '../../../../../../data/services/checks/checks.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-info-check',
    templateUrl: './info-check.component.html',
    styleUrl: './styles/info-check.component.css'
})
export class InfoCheckComponent implements OnChanges {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public id: string = '';
    @Input()
    public amount: number = 0;
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();

    protected checkInfo: IPaymentReceiptResponseModel | null = null;
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _checksManagerService: ChecksManagerService = inject(ChecksManagerService);

    public ngOnChanges(): void {
        this.getReceiptById(this.id);
    }

    protected closeModal(): void {
        this.close.emit();
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
}
