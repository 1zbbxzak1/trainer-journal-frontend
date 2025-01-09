import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {IPracticeModel} from '../../../../../../data/models/schedule/IPractice.model';
import {FormatterService} from '../../../../../services/formatter/formatter.service';

@Component({
    selector: 'app-practice-info',
    templateUrl: './practice-info.component.html',
    styleUrl: './styles/practice-info.component.css'
})
export class PracticeInfoComponent {
    @Input()
    practice: IPracticeModel | null = null;
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    protected attendance: EventEmitter<void> = new EventEmitter<void>();

    protected readonly _formatter: FormatterService = inject(FormatterService);

    protected closeModal(): void {
        this.close.emit();
    }

    protected openModalAttendance(): void {
        this.attendance.emit();
    }
}
