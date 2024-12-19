import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IGetStudentAttendanceResponseModel} from '../../response-models/journal/IGetStudentAttendance.response-model';
import {IAttendanceMarkModel} from '../../models/journal/IAttendanceMark.model';
import {IGetPracticeAttendanceResponseModel} from '../../response-models/journal/IGetPracticeAttendance.response-model';
import {IMarkPracticeAttendanceRequestModel} from '../../request-models/journal/IMarkPracticeAttendance.request-model';

@Injectable()
export class JournalService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}/attendance`;

    public getGroupAttendance(id: string, start: Date, end?: Date): Observable<IGetStudentAttendanceResponseModel[]> {
        const params: any = {start: start.toISOString()};

        if (end) {
            params.end = end.toISOString();
        }

        return this._http.get<IGetStudentAttendanceResponseModel[]>(`${this._apiUrl}/groups/${id}`, {params});
    }

    public getStudentAttendance(username: string, start: Date, end?: Date): Observable<IAttendanceMarkModel[]> {
        const params: any = {start: start.toISOString()};

        if (end) {
            params.end = end.toISOString();
        }

        return this._http.get<IAttendanceMarkModel[]>(`${this._apiUrl}/students/${username}`, {params});
    }

    public markAttendance(username: string, request: IAttendanceMarkModel): Observable<IAttendanceMarkModel | null> {
        return this._http.post<IAttendanceMarkModel | null>(`${this._apiUrl}/students/${username}/mark`, request);
    }

    public unmarkAttendance(username: string, request: IAttendanceMarkModel): Observable<IAttendanceMarkModel | null> {
        return this._http.delete<IAttendanceMarkModel | null>(`${this._apiUrl}/students/${username}/mark`,
            {
                body: request
            }
        );
    }

    public getPracticeAttendance(practiceId: string, practiceStart: Date): Observable<IGetPracticeAttendanceResponseModel[]> {
        return this._http.get<IGetPracticeAttendanceResponseModel[]>(`${this._apiUrl}/practices/${practiceId}`,
            {
                params: {
                    practiceStart: practiceStart.toISOString()
                }
            }
        );
    }

    public markPracticeAttendance(practiceId: string, request: IMarkPracticeAttendanceRequestModel): Observable<void> {
        return this._http.post<void>(`${this._apiUrl}/practices/${practiceId}`, request);
    }
}
