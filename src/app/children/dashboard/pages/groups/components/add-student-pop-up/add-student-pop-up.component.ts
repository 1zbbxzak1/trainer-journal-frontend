import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-add-student-pop-up',
    standalone: false,
    templateUrl: './add-student-pop-up.component.html',
    styleUrl: './styles/add-student-pop-up.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddStudentPopUpComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public firstButton: string = '';
    @Input()
    public secondButton: string = '';

    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected firstButtonClick: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected secondButtonClick: EventEmitter<void> = new EventEmitter<void>();

    protected closeModal(): void {
        this.close.emit();
    }

    protected handleFirstButtonClick(): void {
        this.firstButtonClick.emit();
        this.closeModal();
    }

    protected handleSecondButtonClick(): void {
        this.secondButtonClick.emit();
        this.closeModal();
    }
}
