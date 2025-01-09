import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IStudentItemResponseModel} from '../../response-models/students/IStudentItem.response-model';
import {ICreateStudentRequestModel} from '../../request-models/students/ICreateStudent.request-model';
import {ICreateStudentResponseModel} from '../../response-models/students/ICreateStudent.response-model';
import {IGroupResponseModel} from '../../response-models/groups/IGroup.response-model';
import {IGetStudentBalanceResposeModel} from '../../response-models/students/IGetStudentBalance.respose-model';
import {IBalanceChangeResponseModel} from '../../response-models/students/IBalanceChange.response-model';

@Injectable()
export class StudentsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}/students`;

    public getStudents(withGroup: boolean): Observable<IStudentItemResponseModel[]> {
        const params = new HttpParams()
            .set('withGroup', withGroup);

        return this._http.get<IStudentItemResponseModel[]>(`${this._apiUrl}`, {params});
    }

    public createStudentInGroup(student: ICreateStudentRequestModel): Observable<ICreateStudentResponseModel> {
        return this._http.post<ICreateStudentResponseModel>(`${this._apiUrl}`, student);
    }

    public getStudentGroups(username: string): Observable<IGroupResponseModel[]> {
        return this._http.get<IGroupResponseModel[]>(`${this._apiUrl}/${username}/groups`);
    }

    public getBalanceChanges(username: string, start: Date, end: Date): Observable<IGetStudentBalanceResposeModel[]> {
        const params = new HttpParams()
            .set('start', start.toISOString())
            .set('end', end.toISOString());
        return this._http.get<IGetStudentBalanceResposeModel[]>(`${this._apiUrl}/${username}/balance-changes`, {params});
    }

    public getBalanceChangesReport(username: string, start: Date, end: Date): Observable<IBalanceChangeResponseModel> {
        const params = new HttpParams()
            .set('start', start.toISOString())
            .set('end', end.toISOString());

        return this._http.get<IBalanceChangeResponseModel>(`${this._apiUrl}/${username}/balance-changes/report`, {params});
    }
}
