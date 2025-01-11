import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnChanges, Output} from '@angular/core';
import {IPracticeModel} from '../../../../../../data/models/schedule/IPractice.model';
import {FormatterService} from '../../../../../services/formatter/formatter.service';
import {
    IGetPracticeAttendanceResponseModel
} from '../../../../../../data/response-models/journal/IGetPracticeAttendance.response-model';
import {JournalManagerService} from '../../../../../../data/services/journal/journal.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {
    IMarkPracticeAttendanceRequestModel
} from '../../../../../../data/request-models/journal/IMarkPracticeAttendance.request-model';

@Component({
    selector: 'app-practice-attendance',
    templateUrl: './practice-attendance.component.html',
    styleUrl: './styles/practice-attendance.component.css'
})
export class PracticeAttendanceComponent implements OnChanges {
    @Input()
    practice: IPracticeModel | null = null;
    @Input()
    practiceId: string = '';
    @Input()
    startDate: Date = new Date();
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();

    protected students: IGetPracticeAttendanceResponseModel[] = [];
    protected attendance: Record<string, boolean> = {};
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private originalAttendance: Record<string, boolean> = {};
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _journalManagerService: JournalManagerService = inject(JournalManagerService);

    public ngOnChanges(): void {
        this.getPracticeAttendance();
    }

    protected closeModal(): void {
        this.close.emit();
    }

    protected cancelAttendance(): void {
        this.attendance = {...this.originalAttendance};
        this._cdr.markForCheck();
    }

    protected toggleAttendance(studentIndex: number, event: Event): void {
        const student = this.students[studentIndex];
        const checkbox: HTMLInputElement = event.target as HTMLInputElement;
        const isChecked: boolean = checkbox.checked;

        // Обновление локального состояния
        this.attendance[student.username] = isChecked;

        // Маркировка изменений
        this._cdr.markForCheck();
    }

    protected saveAttendance(): void {
        // Формирование данных для отправки
        const markedUsernames = Object.keys(this.attendance).filter(username => this.attendance[username]);

        const attendanceRequest: IMarkPracticeAttendanceRequestModel = {
            practiceStart: this.startDate.toISOString(),
            markedUsernames: markedUsernames.length > 0 ? markedUsernames : null,
        };

        this._journalManagerService.markPracticeAttendance(this.practiceId, attendanceRequest).subscribe({
            next: (): void => {
                // Обновление оригинального состояния после успешного сохранения
                this.originalAttendance = {...this.attendance};
                this._cdr.markForCheck();

                this.closeModal();
            }
        });
    }


    private getPracticeAttendance(): void {
        this._journalManagerService.getPracticeAttendance(this.practiceId, this.startDate).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (students: IGetPracticeAttendanceResponseModel[]): void => {
                this.students = students;

                this.attendance = {};
                this.students.forEach((student) => {
                    this.attendance[student.username] = student.isMarked || false;
                });

                // Сохранение исходного состояния
                this.originalAttendance = {...this.attendance};

                this._cdr.markForCheck();
            }
        });
    }
}
