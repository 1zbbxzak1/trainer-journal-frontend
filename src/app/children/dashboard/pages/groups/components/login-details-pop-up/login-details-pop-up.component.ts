import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {
    ICreateStudentResponseModel
} from '../../../../../../data/response-models/students/ICreateStudent.response-model';

@Component({
    selector: 'app-login-details-pop-up',
    standalone: false,
    templateUrl: './login-details-pop-up.component.html',
    styleUrl: './styles/login-details-pop-up.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoginDetailsPopUpComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    details!: ICreateStudentResponseModel | null;
    protected confirmAction: EventEmitter<{ username: string, password: string }> = new EventEmitter<{
        username: string,
        password: string
    }>();

    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        if (this.details) {
            const {username, password} = this.details;
            this.confirmAction.emit({username, password});
        }
    }
}
