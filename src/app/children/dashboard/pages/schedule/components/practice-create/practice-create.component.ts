import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, HostListener, Output} from '@angular/core';
import {
    ICreateSinglePracticeRequestModel
} from '../../../../../../data/request-models/schedule/ICreateSinglePractice.request-model';
import {PracticeManagerService} from '../../../../../../data/services/schedule/practice.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IGetGroupResponseModel} from '../../../../../../data/response-models/groups/IGetGroup.response-model';
import {GroupsManagerService} from '../../../../../../data/services/groups/groups.manager.service';
import {FormatterService} from '../../../../../services/formatter/formatter.service';
import {group} from '@angular/animations';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'app-practice-create',
    templateUrl: './practice-create.component.html',
    styleUrl: './styles/practice-create.component.css'
})
export class PracticeCreateComponent {
    @Output()
    public visibleModal: EventEmitter<void> = new EventEmitter<void>();
    @Output()
    public confirmAction: EventEmitter<void> = new EventEmitter<void>();

    protected isLoading: boolean = true;

    protected isDropdownOpen: boolean = false;
    protected groups: IGetGroupResponseModel | null = null;
    protected selectedGroup: string | null = null;
    protected isAddingSessionHide: boolean = false;

    protected weekDays: { date: Date, day: string, weekDay: string, isToday: boolean }[] = [];
    protected selectedDay: { date: Date, day: string, weekDay: string, isToday: boolean } | null = null;
    protected currentWeek: string = '';
    protected timeSlots: string[] = [];

    protected isAddingSession: boolean = false;
    protected hallAddress: string | null = null;
    protected price: number | null = null;
    protected readonly group = group;
    protected formGroup: FormGroup = new FormGroup({
        sessionStartTime: new FormControl('', Validators.required),
        sessionEndTime: new FormControl('', Validators.required),
    })
    private currentDate: Date = new Date();

    constructor(
        private readonly _cdr: ChangeDetectorRef,
        private readonly _destroyRef: DestroyRef,
        private readonly _formatter: FormatterService,
        private readonly _groupsManagerService: GroupsManagerService,
        private readonly practiceManagerService: PracticeManagerService,
    ) {
        this.getAllGroups();
        this.initializeTimeSlots();
        this.initializeWeekDays();
        this.updateWeekDisplay();
    }

    protected toggleSidebar(): void {
        this.visibleModal.emit();
    }

    protected toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
        this._cdr.detectChanges();
    }

    @HostListener('document:click', ['$event'])
    protected closeDropdown(event: MouseEvent): void {
        const target = event.target as HTMLElement;
        if (!target.closest('.dropdown-container')) {
            this.isDropdownOpen = false;
            this._cdr.detectChanges();
        }
    }

    protected selectGroup(groupId: string): void {
        this.selectedGroup = groupId;

        this.hallAddress = this.groups?.groups.find(group => group.id === groupId)?.hallAddress || null;
        this.price = this.groups?.groups.find(group => group.id === groupId)?.price || null;

        this.isDropdownOpen = false;
    }

    protected getGroupNameById(groupId: string | null): string | null {
        return this.groups?.groups.find(group => group.id === groupId)?.name || null;
    }

    protected selectDay(day: { date: Date, day: string, weekDay: string, isToday: boolean }): void {
        // Если текущий день уже выбран, ничего не делаем
        if (this.selectedDay?.date.toDateString() === day.date.toDateString()) {
            return;
        }

        // Устанавливаем новый выбранный день
        this.selectedDay = day;
    }

    protected backButton(): void {
        this.isAddingSession = false;
        this.isAddingSessionHide = false;
    }

    protected changeWeek(direction: number): void {
        this.currentDate.setDate(this.currentDate.getDate() + direction * 7);
        this.timeSlots = [];
        this.initializeTimeSlots();
        this.initializeWeekDays();
        this.updateWeekDisplay();
    }

    // Начать добавление занятия
    protected startAddingSession(): void {
        this.isAddingSession = true;
        this.selectedDay = null;
        this.isAddingSessionHide = true;
    }

    // Сохранить занятие
    protected saveSession(): void {
        const sessionStart = this.formGroup.value.sessionStartTime;
        const sessionEnd = this.formGroup.value.sessionEndTime;

        if (!this.selectedGroup || !this.selectedDay || !sessionStart || !sessionEnd) {
            return;
        }

        const selectedDate = this.selectedDay.date;
        const year = selectedDate.getFullYear();
        const month = selectedDate.getMonth(); // Месяц от 0 до 11
        const day = selectedDate.getDate();

        // Извлекаем время из sessionStartTime и sessionEndTime
        const [startHour, startMinute] = this.formGroup.value.sessionStartTime.split(':').map((num: string) => parseInt(num));
        const [endHour, endMinute] = this.formGroup.value.sessionEndTime.split(':').map((num: string) => parseInt(num));

        // Создаем объекты Date и устанавливаем нужное время
        const newStartDateTime = new Date(year, month, day, startHour, startMinute);
        const newEndDateTime = new Date(year, month, day, endHour, endMinute);

        // Преобразуем в ISO строки
        const startISOString = newStartDateTime.toISOString();
        const endISOString = newEndDateTime.toISOString();

        const request: ICreateSinglePracticeRequestModel = {
            groupId: this.selectedGroup,
            start: startISOString,
            end: endISOString,
            practiceType: 'Тренировка',
            hallAddress: this.hallAddress,
            price: this.price
        };

        this.practiceManagerService.createSinglePractice(request).subscribe({
            next: (): void => {
                this.isAddingSession = false;
                this.isAddingSessionHide = false;

                this.confirmAction.emit();

                this._cdr.detectChanges();
            }
        });
    }

    protected getAllGroups(): void {
        this._groupsManagerService.getAllGroups().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (groups: IGetGroupResponseModel | null): void => {
                this.groups = groups;

                this.timeout(1500);
            },
            error: (): void => {
                this.timeout(1500);
            }
        });
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
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

        for (let i = 0; i < 7; i++) {
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
        const difference: number = (day === 0 ? -6 : 1) - day;
        start.setDate(start.getDate() + difference);
        start.setHours(0, 0, 0, 0);
        return start;
    }

    private updateWeekDisplay(): void {
        const startOfWeek: Date = this.getStartOfWeek(this.currentDate);
        const endOfWeek: Date = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startDay: string = startOfWeek.toLocaleDateString('ru-RU', {day: '2-digit'});
        const startMonth: string = startOfWeek.toLocaleDateString('ru-RU', {month: 'short'});
        const endDay: string = endOfWeek.toLocaleDateString('ru-RU', {day: '2-digit'});
        const endMonth: string = endOfWeek.toLocaleDateString('ru-RU', {month: 'short'});
        const endYear: string = endOfWeek.toLocaleDateString('ru-RU', {year: 'numeric'});

        this.currentWeek = `${startDay} ${startMonth} - ${endDay} ${endMonth} ${endYear}`;
    }

    private isToday(date: Date): boolean {
        const today: Date = new Date();
        return date.toDateString() === today.toDateString();
    }
}
