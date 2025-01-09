import {Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Validator} from '../../../../../../validators/validator';

@Component({
    selector: 'app-decline-comment',
    templateUrl: './decline-comment.component.html',
    styleUrl: './styles/decline-comment.component.css'
})
export class DeclineCommentComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public formGroupReceipt: FormGroup = new FormGroup({
        comment: new FormControl(null, Validators.required),
    });
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();
    private readonly _controlValidator: Validator = new Validator(this.formGroupReceipt);

    protected closeModal(): void {
        this.close.emit();
        this.formGroupReceipt.patchValue({comment: ''})
    }

    protected confirm(): void {
        this.confirmAction.emit();
        this.closeModal();
    }

    protected isControlError(controlName: string): boolean {
        return this._controlValidator.isControlError(controlName);
    }
}
