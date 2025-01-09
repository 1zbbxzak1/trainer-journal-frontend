import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Validator} from '../../../../../../validators/validator';

@Component({
    selector: 'app-edit-amount',
    templateUrl: './edit-amount.component.html',
    styleUrl: './styles/edit-amount.component.css'
})
export class EditAmountComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public formGroupReceipt: FormGroup = new FormGroup({
        amount: new FormControl(null, [Validators.required, Validators.min(1)]),
    });
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();
    private readonly _controlValidator: Validator = new Validator(this.formGroupReceipt);

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.confirmAction.emit();
        this.closeModal();
    }

    protected isControlError(controlName: string): boolean {
        return this._controlValidator.isControlError(controlName);
    }
}
