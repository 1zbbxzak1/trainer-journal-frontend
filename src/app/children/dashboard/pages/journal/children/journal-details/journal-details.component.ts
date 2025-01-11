import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit} from '@angular/core';
import {IGroupResponseModel} from '../../../../../../data/response-models/groups/IGroup.response-model';
import {ActivatedRoute, Params} from '@angular/router';
import {FormatterService} from '../../../../../services/formatter/formatter.service';
import {GroupsManagerService} from '../../../../../../data/services/groups/groups.manager.service';
import {JournalManagerService} from '../../../../../../data/services/journal/journal.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IAttendanceMarkModel} from '../../../../../../data/models/journal/IAttendanceMark.model';
import {
    IGetStudentAttendanceResponseModel
} from '../../../../../../data/response-models/journal/IGetStudentAttendance.response-model';
import {ScheduleManagerService} from '../../../../../../data/services/schedule/schedule.manager.service';
import {IScheduleItemModel} from '../../../../../../data/models/schedule/IScheduleItem.model';

@Component({
    selector: 'app-journal-details',
    standalone: false,
    templateUrl: './journal-details.component.html',
    styleUrls: ['./styles/journal-details.component.css', './../../../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JournalDetailsComponent implements OnInit {
    protected isLoading: boolean = true;
    protected students: any[] = [];
    protected sessions: number[] = [];
    protected currentMonth: string = '';
    protected currentDate: Date = new Date();

    protected attendance: Record<string, Record<number, boolean>> = {};
    protected dayBlocked: Record<number, boolean> = {};
    protected checkboxTableWidth: number = 770;

    protected groupName: string | null = null;
    protected groupHexColor!: string;
    protected groupId!: string;

    private scheduleItems: IScheduleItemModel[] = [];

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        private readonly _destroyRef: DestroyRef,
        private readonly _cdr: ChangeDetectorRef,
        protected readonly _formatter: FormatterService,
        private readonly _groupsManagerService: GroupsManagerService,
        private readonly _scheduleManagerService: ScheduleManagerService,
        private readonly _journalManagerService: JournalManagerService,
    ) {
        const now: Date = new Date();
        this.currentDate = now;
        this.currentMonth = this.formatMonth(now);
    }

    public ngOnInit(): void {
        this._activatedRoute.params.subscribe((params: Params): void => {
            this.groupId = params['id'];

            this.getGroupById(this.groupId);
            this.loadGroupAttendance();
        });
    }

    // Переход к следующему месяцу
    protected nextMonth(): void {
        const newDate: Date = new Date(this.currentDate);
        newDate.setMonth(this.currentDate.getMonth() + 1);
        this.currentDate = newDate;
        this.currentMonth = this.formatMonth(newDate);
        this.loadSessions();
        this.loadGroupAttendance();
    }

    // Переход к предыдущему месяцу
    protected prevMonth(): void {
        const newDate: Date = new Date(this.currentDate);
        newDate.setMonth(this.currentDate.getMonth() - 1);
        this.currentDate = newDate;
        this.currentMonth = this.formatMonth(newDate);
        this.loadSessions();
        this.loadGroupAttendance();
    }

    protected formatShortMonth(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {month: 'short'};
        return date.toLocaleDateString('ru-RU', options);
    }

    protected toggleAttendance(studentIndex: number, day: number, event: Event): void {
        const student = this.students[studentIndex];
        const checkbox: HTMLInputElement = event.target as HTMLInputElement; // Получить состояние чекбокса из события
        const isChecked: boolean = checkbox.checked;

        const monthKey: string = this.currentDate.toISOString().slice(0, 7);
        if (!this.attendance[monthKey]) {
            this.attendance[monthKey] = {};
        }

        const scheduleItem = this.scheduleItems.find(item => {
            const scheduleDate: Date = new Date(item.start);
            return scheduleDate.getDate() === day;
        });

        const attendanceRequest: IAttendanceMarkModel = {
            practiceId: scheduleItem!.id,
            practiceStart: scheduleItem!.start,
        };

        if (isChecked) {
            // Если отмечаем посещение
            this._journalManagerService.markAttendance(student.username, attendanceRequest).subscribe({
                next: (): void => {
                    this.attendance[monthKey][day] = true;
                    this.loadGroupAttendance();
                    this._cdr.markForCheck();
                },
                error: (): void => {
                    this.attendance[monthKey][day] = false;
                    this._cdr.markForCheck();
                },
            });
        } else {
            // Если удаляем посещение
            this._journalManagerService.unmarkAttendance(student.username, attendanceRequest).subscribe({
                next: (): void => {
                    this.attendance[monthKey][day] = false;
                    this.loadGroupAttendance();
                    this._cdr.markForCheck();
                },
                error: (): void => {
                    this.attendance[monthKey][day] = true;
                    this._cdr.markForCheck();
                },
            });
        }
    }


    protected formatterFullName(fullName: string): string {
        return this._formatter.formatFullName(fullName);
    }

    protected getColorForBalance(balance: number): string {
        if (balance < 0) {
            return "#f93232";
        } else {
            return "#439f6e";
        }
    }

    private loadSessions(): void {
        this.sessions = this.scheduleItems.map((item: IScheduleItemModel) => {
            const scheduleDate: Date = new Date(item.start);
            return scheduleDate.getDate();
        });
    }

    private getGroupById(id: string | null): void {
        this._groupsManagerService.getGroupById(id).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (group: IGroupResponseModel | null): void => {
                if (group?.name) {
                    this.groupName = group.name;
                }

                if (group?.hexColor) {
                    this.groupHexColor = group.hexColor;
                }

                this.timeout(1500);
            },
            error: (): void => {
                this.timeout(1500);
            }
        });
    }

    private loadGroupAttendance(): void {
        if (!this.groupId) return;

        const startOfMonth: Date = this.getStartOfMonth();
        const endOfMonth: Date = this.getEndOfMonth();

        this._journalManagerService.getGroupAttendance(this.groupId, startOfMonth, endOfMonth)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (attendance: IGetStudentAttendanceResponseModel[]): void => {
                    this.students = attendance.map((record: IGetStudentAttendanceResponseModel, index: number) => ({
                        index: index + 1,
                        username: record.username,
                        fullName: record.fullName,
                        startBalance: record.startBalance,
                        expenses: record.expenses,
                        payments: record.payments,
                        endBalance: record.endBalance,
                        attendance: this.mapAttendanceToDays(record.attendance),
                        length: record.attendance.length,
                    }));

                    this._cdr.markForCheck();

                    this.scrollToCurrentWeek();
                },
            });

        this._scheduleManagerService.getGroupSchedule(this.groupId, startOfMonth, 1)
            .pipe(takeUntilDestroyed(this._destroyRef))
            .subscribe({
                next: (schedule: IScheduleItemModel[]): void => {
                    this.scheduleItems = schedule;

                    this.updateDayBlockStatus();
                    this.loadSessions();

                    this.timeout(1500);

                    this._cdr.markForCheck();
                },
                error: (): void => {
                    this.timeout(1500);
                }
            });
    }

    private getStartOfMonth(): Date {
        const now: Date = new Date();
        return new Date(now.getFullYear(), now.getMonth(), 1);
    }

    private getEndOfMonth(): Date {
        const now: Date = new Date();
        return new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    private mapAttendanceToDays(attendance: IAttendanceMarkModel[]): Record<number, boolean> {
        const daysAttendance: Record<number, boolean> = {};
        const monthKey: string = this.currentDate.toISOString().slice(0, 7);

        attendance.forEach((mark: IAttendanceMarkModel): void => {
            const markDate: Date = new Date(mark.practiceStart);
            const markMonthKey: string = markDate.toISOString().slice(0, 7);

            if (monthKey === markMonthKey) {
                const day: number = markDate.getDate();
                daysAttendance[day] = true;
            }
        });

        return daysAttendance;
    }

    private updateDayBlockStatus(): void {
        const daysInMonth: number = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 0).getDate();

        this.dayBlocked = {};

        for (let day = 1; day <= daysInMonth; day++) {
            const scheduleItem: IScheduleItemModel | undefined = this.scheduleItems.find((item: IScheduleItemModel): boolean => {
                const scheduleDate: Date = new Date(item.start);
                return scheduleDate.getDate() === day;
            });

            this.dayBlocked[day] = !scheduleItem;
        }
    }

    private scrollToCurrentWeek(): void {
        const today: Date = new Date();
        const scrollableTable: Element | null = document.querySelector('.scrollable-table-wrapper');

        if (!scrollableTable) return;

        if (
            today.getFullYear() !== this.currentDate.getFullYear() ||
            today.getMonth() !== this.currentDate.getMonth()
        ) {
            scrollableTable.scrollTo({
                left: 0,
                behavior: 'smooth',
            });
            return;
        }

        const currentDay: number = today.getDate();
        const currentWeekIndex: number = Math.floor((currentDay - 1) / 7);
        const columnWidth = 723;
        const scrollPosition: number = currentWeekIndex * columnWidth;

        scrollableTable.scrollTo({
            left: scrollPosition,
            behavior: 'smooth',
        });

    }

    private formatMonth(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {month: 'long', year: 'numeric'};
        return date.toLocaleDateString('ru-RU', options);
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
    }
}
