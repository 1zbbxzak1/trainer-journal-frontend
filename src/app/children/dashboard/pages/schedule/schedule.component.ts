import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    DestroyRef,
    inject,
    OnInit,
    Renderer2
} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IGetGroupResponseModel} from '../../../../data/response-models/groups/IGetGroup.response-model';
import {GroupsManagerService} from '../../../../data/services/groups/groups.manager.service';
import {ScheduleManagerService} from '../../../../data/services/schedule/schedule.manager.service';
import {IScheduleItemModel} from '../../../../data/models/schedule/IScheduleItem.model';
import {PracticeManagerService} from '../../../../data/services/schedule/practice.manager.service';
import {
    ICreateSinglePracticeRequestModel
} from '../../../../data/request-models/schedule/ICreateSinglePractice.request-model';
import {IPracticeModel} from '../../../../data/models/schedule/IPractice.model';
import {FormatterService} from '../../../services/formatter/formatter.service';
import {ColorGroup, ColorKey, ColorSchedule} from './types/types-color';

@Component({
    selector: 'app-schedule',
    standalone: false,

    templateUrl: './schedule.component.html',
    styleUrls: ['./styles/schedule.component.css', '../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScheduleComponent implements OnInit {
    protected groups: IGetGroupResponseModel | null = null;
    protected practice: IPracticeModel | null = null;
    protected selectedGroup: string | null = null;
    protected currentWeek = '';
    protected weekDays: { date: Date, day: string, weekDay: string, isToday: boolean }[] = [];
    protected selectedDay: { date: Date, day: string, weekDay: string, isToday: boolean } | null = null;
    protected timeSlots: string[] = [];
    protected sessionStartTime = '';
    protected sessionEndTime = '';
    protected isAddingSession = false;

    protected practiceId: string = '';
    protected startDate: Date = new Date();
    protected isSidebarOpen = false;
    protected isSidebarInfoOpen = false;
    protected hallAddress = null;
    protected price = null;
    protected scheduleData: IScheduleItemModel[] = [];
    protected readonly _formatter: FormatterService = inject(FormatterService);
    private currentDate: Date = new Date();
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _groupsManagerService: GroupsManagerService = inject(GroupsManagerService);
    private readonly _scheduleManagerService: ScheduleManagerService = inject(ScheduleManagerService);
    private readonly _practicesManagerService: PracticeManagerService = inject(PracticeManagerService);
    private colorSchedule = new ColorSchedule();

    constructor(
        private readonly practiceManagerService: PracticeManagerService,
        private readonly renderer: Renderer2
    ) {
        this.initializeTimeSlots();
        this.initializeWeekDays();
        this.updateWeekDisplay();
    }

    public ngOnInit(): void {
        this.loadSchedule();
        this.getAllGroups();
    }

    // Начать добавление занятия
    protected startAddingSession(): void {
        this.isAddingSession = true;
        this.selectedDay = null;
        this.sessionStartTime = '';
        this.sessionEndTime = '';
    }

    // Сохранить занятие
    protected saveSession(): void {
        if (!this.selectedGroup || !this.selectedDay || !this.sessionStartTime || !this.sessionEndTime) {
            alert('Заполните все поля!');
            return;
        }

        const startDateTime: Date = new Date(this.selectedDay.date);
        startDateTime.setHours(+this.sessionStartTime.split(':')[0], +this.sessionStartTime.split(':')[1]);

        const endDateTime: Date = new Date(this.selectedDay.date);
        endDateTime.setHours(+this.sessionEndTime.split(':')[0], +this.sessionEndTime.split(':')[1]);

        const request: ICreateSinglePracticeRequestModel = {
            groupId: this.selectedGroup,
            start: startDateTime.toISOString(),
            end: endDateTime.toISOString(),
            practiceType: 'тренировка',
            hallAddress: null,
            price: null
        };

        this.practiceManagerService.createSinglePractice(request).subscribe({
            next: (): void => {
                alert('Занятие успешно создано!');
                this.isAddingSession = false;

                this._cdr.detectChanges();
            },
            error: (): void => {
                alert('Произошла ошибка при создании занятия.');
            }
        });
    }

    protected selectDay(day: { date: Date, day: string, weekDay: string, isToday: boolean }): void {
        this.selectedDay = day;
    }

    protected onGroupChange(event: Event): void {
        const selectElement: HTMLSelectElement = event.target as HTMLSelectElement;
        this.selectedGroup = selectElement.value;
    }

    protected toggleSidebar(): void {
        this.isSidebarOpen = !this.isSidebarOpen;
        this.updateScroll();
    }

    protected toggleSidebarInfo(id: string, practiceDate: Date): void {
        this.updateScroll();
        this.isSidebarInfoOpen = true;

        this.getInfoPractice(id, practiceDate);
        this.practiceId = id;
        this.startDate = practiceDate;
    }

    protected closeSidebarInfo(): void {
        this.isSidebarInfoOpen = !this.isSidebarInfoOpen;
        this.updateScroll();
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

                const color = item.colorKey;

                return {
                    ...item,
                    startTime,
                    endTime,
                    duration,
                    color
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

    protected getColorForSchedule(name: string | null | undefined): ColorGroup {
        if (!name) {
            // Default color for invalid names
            return this.colorSchedule.colorGroups.blue;
        }

        // Normalize and enrich the input
        const enrichedName = name.toLowerCase().replace(/[^a-zа-яё0-9]/gi, '');

        const colorKeys = Object.keys(this.colorSchedule.colorGroups) as ColorKey[];
        const sortedKeys = [...colorKeys].sort();

        // Generate a unique hash for the enriched name
        const hash = this.generateHash(enrichedName);

        // Use the hash value to determine the index
        const index = hash % sortedKeys.length;

        return this.colorSchedule.colorGroups[sortedKeys[index]];
    }

    private generateHash(input: string): number {
        let hash = 0;
        for (let i = 0; i < input.length; i++) {
            hash = (hash << 5) - hash + input.charCodeAt(i) * (i + 1); // Multiply by position
            hash |= 0; // Ensure 32-bit integer
        }
        return Math.abs(hash);
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
        } else if (durationInMinutes > 60 && durationInMinutes < 90) {
            return 62;
        } else if (durationInMinutes === 90) {
            return 70;
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

    private getAllGroups(): void {
        this._groupsManagerService.getAllGroups().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (groups: IGetGroupResponseModel | null): void => {
                this.groups = groups;

                this._cdr.detectChanges();
            },
        });
    }

    private formatTime(date: Date): string {
        const options: Intl.DateTimeFormatOptions = {hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Moscow'};
        return date.toLocaleTimeString('ru-RU', options);
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
                this.scheduleData = schedule.map((item) => ({
                    ...item,
                    colorKey: this.getColorForSchedule(item.groupName), // Присваиваем цвет
                }));

                this._cdr.detectChanges();
            },
        });
    }

    private isToday(date: Date): boolean {
        const today: Date = new Date();
        return date.toDateString() === today.toDateString();
    }

    private updateScroll(): void {
        const container = document.querySelector('.global-container');
        if (!container) {
            console.warn('global-container не найден');
            return;
        }

        if (this.isSidebarOpen || this.isSidebarInfoOpen) {
            container.setAttribute('style', 'overflow: hidden;');
        } else {
            container.removeAttribute('style');
        }
    }
}
