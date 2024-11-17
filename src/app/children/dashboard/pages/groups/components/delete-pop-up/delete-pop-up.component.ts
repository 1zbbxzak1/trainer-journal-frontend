import {Component, EventEmitter, Input, Output} from '@angular/core';

@Component({
    selector: 'app-delete-pop-up',
    templateUrl: './delete-pop-up.component.html',
    styleUrl: './styles/delete-pop-up.component.css'
})
export class DeletePopUpComponent {
    @Input()
    public isVisible: boolean = false;
    @Input()
    public title: string = '';
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.confirmAction.emit();
    }
}
