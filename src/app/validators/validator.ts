import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';

export class Validator {
    private readonly _formGroup!: FormGroup;

    constructor(
        formGroup: FormGroup
    ) {
        this._formGroup = formGroup;
    }

    public getFormControl(controlName: string): AbstractControl | null {
        return this._formGroup!.get(controlName);
    }

    public isControlError(controlName: string): boolean {
        const control: AbstractControl | null = this.getFormControl(controlName);
        return !!control && control.invalid && (control.dirty || control.touched);
    }

    public isControlRequired(controlName: string): boolean {
        const control: AbstractControl | null = this.getFormControl(controlName);
        return !!control && control.hasError('required');
    }

    public isCorrectUserName(controlName: string): boolean {
        const control: AbstractControl | null = this.getFormControl(controlName);
        return !!control && control.hasError('invalidFullName');
    }

    public isPasswordInvalid(controlName: string): boolean {
        const control: AbstractControl | null = this.getFormControl(controlName);
        return !!control && control.hasError('minlength');
    }
}

