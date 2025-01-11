import {ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {IFullInfoModel} from '../../../../data/models/profile/IFullInfo.model';
import {ProfileManagerService} from '../../../../data/services/profile/profile.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormatterService} from '../../../services/formatter/formatter.service';
import {AuthManagerService} from '../../../../data/services/auth/auth.manager.service';
import {IScheduleItemModel} from '../../../../data/models/schedule/IScheduleItem.model';
import {IGroupResponseModel} from '../../../../data/response-models/groups/IGroup.response-model';
import {StudentsManagerService} from '../../../../data/services/students/students.manager.service';
import {ScheduleManagerService} from '../../../../data/services/schedule/schedule.manager.service';
import {forkJoin} from 'rxjs';
import {IBalanceChangeResponseModel} from '../../../../data/response-models/students/IBalanceChange.response-model';
import {JournalManagerService} from '../../../../data/services/journal/journal.manager.service';
import {IAttendanceMarkModel} from '../../../../data/models/journal/IAttendanceMark.model';

@Component({
    selector: 'app-student-profile',
    templateUrl: './student-profile.component.html',
    styleUrls: ['./styles/student-profile.component.css', '../../styles/student-dashboard-styles.css']
})
export class StudentProfileComponent implements OnInit {
    protected isLoading: boolean = true;
    protected infoMe!: IFullInfoModel | null;
    protected currentMonth: string = '';

    protected groupsId: string[] = [];
    protected scheduleData: IScheduleItemModel[] = [];
    protected sessions: { [key: string]: string[] } = {};
    protected attendanceDates: Set<string> = new Set();

    protected countPractice: number = 0;
    protected balanceReport: IBalanceChangeResponseModel | null = null;

    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private currentDate: Date = new Date();
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _profileManagerService: ProfileManagerService = inject(ProfileManagerService);
    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);
    private readonly _studentManagerService: StudentsManagerService = inject(StudentsManagerService);
    private readonly _scheduleManagerService: ScheduleManagerService = inject(ScheduleManagerService);
    private readonly _attendanceManagerService: JournalManagerService = inject(JournalManagerService);

    public ngOnInit(): void {
        this.getInfoMe();
        const now: Date = new Date();
        this.currentDate = now;
        this.currentMonth = this.formatMonth(now);
    }

    protected getColorForBalance(balance: number): string {
        if (balance < 0) {
            return "#f93232";
        } else {
            return "#439f6e";
        }
    }

    protected getGender(gender: string): string {
        if (gender === 'М') {
            return 'Мужской';
        } else {
            return 'Женский';
        }
    }

    protected deleteCookie(): void {
        this._authManagerService.logout();
        this._cdr.detectChanges();
    }

    protected nextMonth(): void {
        const newDate: Date = new Date(this.currentDate);
        newDate.setMonth(this.currentDate.getMonth() + 1);
        this.currentDate = newDate;
        this.currentMonth = this.formatMonth(newDate);
        this.scheduleData = [];

        // Перезагрузка данных практики и сессий для нового месяца
        this.loadPractice();

        // Обновление background и color для дней
        this.updateAttendanceStyles();
    }

    protected prevMonth(): void {
        const newDate: Date = new Date(this.currentDate);
        newDate.setMonth(this.currentDate.getMonth() - 1);
        this.currentDate = newDate;
        this.currentMonth = this.formatMonth(newDate);
        this.scheduleData = [];

        // Перезагрузка данных практики и сессий для нового месяца
        this.loadPractice();

        // Обновление background и color для дней
        this.updateAttendanceStyles();
    }

    protected getDayBackground(day: string, date: string): string {
        const today: Date = new Date();
        const [dayNumber, monthName] = date.split(' ');
        const dateObj: Date = new Date(today.getFullYear(), this.getMonthIndex(monthName), +dayNumber);

        let background: string = 'var(--bg-grey)';  // По умолчанию - серый фон

        if (dateObj > today) {
            background = 'var(--bg-grey)';  // Если дата в будущем - серый фон
        }

        const formattedDate = this.formatDateToShort(dateObj);

        if (this.attendanceDates.has(formattedDate)) {
            background = '#ebffe1';  // День отмечен как посещённый
        }

        return background;
    }

    protected getDayTitleStyle(day: string, date: string): string {
        const today: Date = new Date();
        const [dayNumber, monthName] = date.split(' ');
        const dateObj: Date = new Date(today.getFullYear(), this.getMonthIndex(monthName), +dayNumber);

        let color: string = 'var(--text-black)';  // По умолчанию - серый фон

        if (dateObj > today) {
            color = 'var(--text-disable-light-grey)';  // Если дата в будущем - серый фон
        }

        const formattedDate = this.formatDateToShort(dateObj);

        if (this.attendanceDates.has(formattedDate)) {
            color = '#439f6e';  // День отмечен как посещённый
        }

        return color;
    }

    private updateAttendanceStyles(): void {
        const startOfMonth: Date = this.getStartOfMonth(this.currentDate);
        const endOfMonth: Date = this.getEndOfMonth(this.currentDate);
        this.getStudentAttendance(this.infoMe!.username, startOfMonth, endOfMonth);
        this._cdr.markForCheck();
    }

    private getInfoMe(): void {
        this._profileManagerService.getInfoMe().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (profile: IFullInfoModel | null): void => {
                this.infoMe = profile;

                this.getGroups(this.infoMe!.username);
                this.getBalanceChangeReport(this.infoMe!.username);

                this.timeout(1500);
            }
        })
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
    }

    private formatMonth(date: Date): string {
        const startOfMonth: Date = this.getStartOfMonth(date);
        const endOfMonth: Date = this.getEndOfMonth(date);

        const startDay: number = startOfMonth.getDate();
        const endDay: number = endOfMonth.getDate();
        const monthYear: string = date.toLocaleDateString('ru-RU', {month: 'short', year: 'numeric'});

        return `${startDay} - ${endDay} ${monthYear}`;
    }

    private getStartOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth(), 1);
    }

    private getEndOfMonth(date: Date): Date {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0);
    }

    private getGroups(username: string): void {
        this._studentManagerService.getStudentGroups(username).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (groups: IGroupResponseModel[]): void => {
                for (const group of groups) {
                    this.groupsId.push(group.id);
                }

                this.loadPractice();

                this.timeout(1500);
            },
            error: (): void => {
                this.timeout(1500);
            }
        });
    }

    private loadPractice(): void {
        const startOfMonth: Date = this.getStartOfMonth(this.currentDate);

        this.scheduleData = [];

        const scheduleObservables = this.groupsId.map((groupId: string) =>
            this._scheduleManagerService.getGroupSchedule(groupId, startOfMonth, 1)
        );

        forkJoin(scheduleObservables).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (schedules: IScheduleItemModel[][]): void => {
                // Объединяем все полученные расписания в один массив
                this.scheduleData = schedules.flat().map((item) => ({
                    ...item,
                }));

                this.getStudentAttendance(this.infoMe!.username, this.currentDate, this.getEndOfMonth(this.currentDate));
                this.countPractice = this.scheduleData.length;

                this.loadSessions();

                this._cdr.markForCheck();
            }
        });
    }

    private getBalanceChangeReport(username: string): void {
        this._studentManagerService.getCurrentMonthBalanceChangesReport(username).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (report: IBalanceChangeResponseModel): void => {
                this.balanceReport = report;

                this.timeout(1500);
            },
            error: (): void => {
                this.timeout(1500);
            }
        })
    }

    private loadSessions(): void {
        const daysOfWeek: string[] = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
        const groupedSessions: { [key: string]: string[] } = {
            Пн: [], Вт: [], Ср: [], Чт: [], Пт: [], Сб: [], Вс: []
        };

        this.scheduleData.forEach((item: IScheduleItemModel): void => {
            const scheduleDate: Date = new Date(item.start);
            const dayOfWeek: string = daysOfWeek[(scheduleDate.getDay() === 0 ? 6 : scheduleDate.getDay() - 1)];
            const formattedDate: string = this.formatDateToShort(scheduleDate);
            groupedSessions[dayOfWeek]?.push(formattedDate);
        });

        this.sessions = groupedSessions;
    }

    private formatDateToShort(date: Date): string {
        return date.toLocaleDateString('ru-RU', {day: 'numeric', month: 'short'});
    }

    private getStudentAttendance(username: string, start: Date, end?: Date): void {
        this._attendanceManagerService.getStudentAttendance(username, start, end).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (attendance: IAttendanceMarkModel[]): void => {
                // Сохраняем даты посещений в формате 'дд.мм.гггг' для быстрого поиска
                this.attendanceDates = new Set(
                    attendance.map((entry) => this.formatDateToShort(new Date(entry.practiceStart)))
                );
            }
        });
    }

    private getMonthIndex(month: string): number {
        const months = ['янв.', 'фев.', 'мар.', 'апр.', 'май', 'июн.', 'июл.', 'авг.', 'сен.', 'окт.', 'ноя.', 'дек.'];
        return months.indexOf(month.toLowerCase());
    }
}
