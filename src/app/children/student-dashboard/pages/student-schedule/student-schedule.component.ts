import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {IPracticeModel} from '../../../../data/models/schedule/IPractice.model';
import {IScheduleItemModel} from '../../../../data/models/schedule/IScheduleItem.model';
import {FormatterService} from '../../../services/formatter/formatter.service';
import {ScheduleManagerService} from '../../../../data/services/schedule/schedule.manager.service';
import {PracticeManagerService} from '../../../../data/services/schedule/practice.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-student-schedule',
    standalone: false,

    templateUrl: './student-schedule.component.html',
    styleUrls: ['./styles/student-schedule.component.css', '../../styles/student-dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentScheduleComponent implements OnInit {
    protected username = '';
    protected groupId = '';
    protected practice: IPracticeModel | null = null;
    protected currentWeek = '';
    protected weekDays: { date: Date, day: string, weekDay: string, isToday: boolean }[] = [];
    protected timeSlots: string[] = [];

    protected isSidebarInfoOpen = false;
    protected hallAddress = null;
    protected price = null;
    protected scheduleData: IScheduleItemModel[] = [];
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private currentDate: Date = new Date();
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _scheduleManagerService: ScheduleManagerService = inject(ScheduleManagerService);
    private readonly _practicesManagerService: PracticeManagerService = inject(PracticeManagerService);

    constructor() {
    }

    public ngOnInit(): void {
        this.initializeTimeSlots();
        this.initializeWeekDays();
        this.updateWeekDisplay();
        this.loadSchedule();
    }

    protected toggleSidebarInfo(id: string, practiceDate: Date): void {
        this.isSidebarInfoOpen = !this.isSidebarInfoOpen;

        this.getInfoPractice(id, practiceDate);
    }

    protected closeSidebarInfo(): void {
        this.isSidebarInfoOpen = !this.isSidebarInfoOpen;
    }

    protected getInfoPractice(id: string, practiceDate: Date): void {
        if (this.isSidebarInfoOpen) {
            this._practicesManagerService.getPractice(id, practiceDate).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (practice: IPracticeModel): void => {
                    this.practice = practice;

                    this._cdr.detectChanges();
                }
            });
        }
    }

    protected changeWeek(direction: number): void {
        this.currentDate.setDate(this.currentDate.getDate() + direction * 7);
        this.timeSlots = [];
        this.initializeTimeSlots();
        this.initializeWeekDays();
        this.updateWeekDisplay();
        this.loadSchedule();
    }

    protected getScheduleForSlot(date: Date, slot: string) {
        return this.scheduleData
            .filter((item: IScheduleItemModel): boolean => {
                if (!item.start || !item.end) return false;

                const itemStart: Date = new Date(item.start);

                // Проверяем, начинается ли тренировка в текущем слоте
                const slotTime: Date = this.parseTime(slot, date);
                const nextSlotTime: Date = new Date(slotTime);
                nextSlotTime.setMinutes(nextSlotTime.getMinutes() + 60); // Следующий слот через 1 час

                return (
                    itemStart.toDateString() === date.toDateString() && // День совпадает
                    itemStart >= slotTime && itemStart < nextSlotTime // Начало попадает в текущий слот
                );

            }).map(item => {
                const startTime = new Date(item.start);
                const endTime = new Date(item.end);

                const duration = this.calculateDuration(startTime, endTime);

                console.log(duration);

                return {
                    ...item,
                    startTime,
                    endTime,
                    duration
                };
            });
    }

    protected calculateTop(startTime: Date): number {
        const startOfDay = new Date(startTime);
        startOfDay.setHours(7, 0, 0, 0); // Устанавливаем время в 00:00

        // Получаем разницу в минутах
        const diffInMilliseconds = startTime.getTime() - startOfDay.getTime();

        // Переводим разницу в минуты
        const diffInMinutes = diffInMilliseconds / (1000 * 60);

        const pixelsPerMinute = 0.0001;

        let top = diffInMinutes * pixelsPerMinute;

        if (startTime.getMinutes() === 30) {
            top += 30;
        } else if (startTime.getMinutes() === 45) {
            top += 45;
        }

        return top;
    }

    private parseTime(slot: string, date: Date): Date {
        const [hours, minutes] = slot.split(':').map(Number);
        const result = new Date(date);
        result.setHours(hours, minutes, 0, 0);
        return result;
    }

    private calculateDuration(startTime: Date, endTime: Date): number {
        // Разница во времени в миллисекундах
        const durationInMilliseconds = endTime.getTime() - startTime.getTime();

        // Конвертация в минуты
        const durationInMinutes = durationInMilliseconds / (1000 * 60);

        const minutesPerSlot = 60;

        if (durationInMinutes === 60) {
            return 41;
        } else if (durationInMinutes === 75) {
            return 51;
        } else if (durationInMinutes > 60 && durationInMinutes <= 90) {
            return 62;
        } else if (durationInMinutes > 90 && durationInMinutes < 120) {
            return 72;
        } else if (durationInMinutes == 120) {
            return 93;
        } else if (durationInMinutes < 60) {
            return 30;
        }

        // Рассчитываем количество слотов
        return durationInMinutes / minutesPerSlot + 36;
    }

    private initializeTimeSlots(): void {
        const startTime = 7; // Начало в 7:00
        const endTime = 23; // Конец в 23:00

        this.timeSlots = [];
        for (let hour = startTime; hour <= endTime; hour++) {
            const hourString = hour.toString().padStart(2, '0');
            this.timeSlots.push(`${hourString}:00`);
        }
    }

    private initializeWeekDays(): void {
        const startOfWeek: Date = this.getStartOfWeek(this.currentDate);
        this.weekDays = [];

        for (let i = 0; i < 7; i++) { // Заполняем 7 дней
            const date: Date = new Date(startOfWeek);
            date.setDate(date.getDate() + i);
            this.weekDays.push({
                date: date,
                day: date.toLocaleDateString('ru-RU', {day: '2-digit'}),
                weekDay: date.toLocaleDateString('ru-RU', {weekday: 'short'}),
                isToday: this.isToday(date),
            });
        }
    }

    private getStartOfWeek(date: Date): Date {
        const start: Date = new Date(date);
        const day: number = start.getDay();
        const difference: number = (day === 0 ? -6 : 1) - day; // Понедельник = 0
        start.setDate(start.getDate() + difference);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    private updateWeekDisplay(): void {
        const startOfWeek: Date = this.getStartOfWeek(this.currentDate);
        const endOfWeek: Date = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        };

        this.currentWeek = `${startOfWeek.toLocaleDateString('ru-RU', options)} - ${endOfWeek.toLocaleDateString('ru-RU', options)}`;
    }

    private loadSchedule(): void {
        const startOfWeek: Date = this.getStartOfWeek(this.currentDate);

        this._scheduleManagerService.getSchedule(startOfWeek, 1).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (schedule: IScheduleItemModel[]): void => {
                this.scheduleData = schedule;

                this.initializeTimeSlots();

                this._cdr.detectChanges();

                console.log(this.scheduleData);
            },
        });
    }

    private isToday(date: Date): boolean {
        const today: Date = new Date();
        return date.toDateString() === today.toDateString();
    }
}
