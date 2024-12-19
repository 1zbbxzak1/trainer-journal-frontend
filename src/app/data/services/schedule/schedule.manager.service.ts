import {inject, Injectable} from '@angular/core';
import {ScheduleService} from './schedule.service';
import {Observable} from 'rxjs';
import {IScheduleItemModel} from '../../models/schedule/IScheduleItem.model';
import {ICreateScheduleRequestModel} from '../../request-models/schedule/ICreateSchedule.request-model';

@Injectable()
export class ScheduleManagerService {
    private readonly scheduleService: ScheduleService = inject(ScheduleService);

    getSchedule(date: Date, view: number = 0): Observable<IScheduleItemModel[]> {
        return this.scheduleService.getSchedule(date, view);
    }

    // Метод для получения расписания группы
    getGroupSchedule(groupId: string, date: Date, view: number = 0): Observable<IScheduleItemModel[]> {
        return this.scheduleService.getGroupSchedule(groupId, date, view);
    }

    // Метод для создания расписания
    createSchedule(groupId: string, request: ICreateScheduleRequestModel): Observable<IScheduleItemModel[]> {
        return this.scheduleService.createSchedule(groupId, request);
    }
}
