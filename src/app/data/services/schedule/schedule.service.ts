import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Observable} from 'rxjs';
import {IScheduleItemModel} from '../../models/schedule/IScheduleItem.model';
import {ICreateScheduleRequestModel} from '../../request-models/schedule/ICreateSchedule.request-model';

@Injectable()
export class ScheduleService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}`;

    getSchedule(date: Date, view: number = 0): Observable<IScheduleItemModel[]> {
        const params = new HttpParams()
            .set('date', date.toISOString())
            .set('view', view);

        return this._http.get<IScheduleItemModel[]>(`${this._apiUrl}/schedule`, {params});
    }

    // Получение расписания группы
    getGroupSchedule(groupId: string, date: Date, view: number = 0): Observable<IScheduleItemModel[]> {
        const params = new HttpParams()
            .set('date', date.toISOString())
            .set('view', view);

        return this._http.get<IScheduleItemModel[]>(`${this._apiUrl}/groups/${groupId}/schedule`, {params});
    }

    // Создание расписания
    createSchedule(groupId: string, request: ICreateScheduleRequestModel): Observable<IScheduleItemModel[]> {
        return this._http.post<IScheduleItemModel[]>(`${this._apiUrl}/groups/${groupId}/schedule`, request);
    }
}
