import {Component, ElementRef, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {Validator} from '../../../../../../validators/validator';

@Component({
    selector: 'app-send-check',
    templateUrl: './send-check.component.html',
    styleUrl: './styles/send-check.component.css'
})
export class SendCheckComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public title: string = '';
    @Input()
    public confirmTitle: string = '';
    @Input()
    public formGroup: FormGroup = new FormGroup({
        file: new FormControl(null, Validators.required),
        amount: new FormControl(null, Validators.required),
    });
    @ViewChild('fileInput')
    public fileInput!: ElementRef;
    public selectedFile: File | null = null;
    public selectedFilePreview: string | null = null;
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

    protected onFileSelected(event: Event): void {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            this.selectedFile = file;

            // Создание предварительного просмотра изображения
            const reader = new FileReader();
            reader.onload = (e) => {
                this.selectedFilePreview = e.target?.result as string;
            };
            reader.readAsDataURL(file);

            // Обновление формы
            this.formGroup.patchValue({file});
            this.formGroup.get('file')?.updateValueAndValidity();
        }
    }
}
