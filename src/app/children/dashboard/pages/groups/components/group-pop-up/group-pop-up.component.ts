import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Validator} from '../../../../../../validators/validator';

@Component({
    selector: 'app-group-pop-up',
    standalone: false,

    templateUrl: './group-pop-up.component.html',
    styleUrl: './styles/group-pop-up.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GroupPopUpComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public title: string = '';
    @Input()
    public confirmTitle: string = '';
    @Input()
    public formGroup: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
        hallAddress: new FormControl('', Validators.required),
    });
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();

    private readonly _controlValidator: Validator = new Validator(this.formGroup);

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.confirmAction.emit();
    }

    protected isControlError(controlName: string): boolean {
        return this._controlValidator.isControlError(controlName);
    }
}
