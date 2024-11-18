import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IStudentItemResponseModel} from '../../response-models/students/IStudentItem.response-model';
import {ICreateStudentRequestModel} from '../../request-models/students/ICreateStudent.request-model';
import {ICreateStudentResponseModel} from '../../response-models/students/ICreateStudent.response-model';
import {IGroupResponseModel} from '../../response-models/groups/IGroup.response-model';

@Injectable()
export class StudentsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}/students`;

    public getStudents(withGroup: boolean = true): Observable<IStudentItemResponseModel[]> {
        return this._http.get<IStudentItemResponseModel[]>(`${this._apiUrl}?withGroup=${withGroup}`);
    }

    public createStudentInGroup(student: ICreateStudentRequestModel): Observable<ICreateStudentResponseModel> {
        return this._http.post<ICreateStudentResponseModel>(`${this._apiUrl}`, student);
    }

    public getStudentGroups(username: string): Observable<IGroupResponseModel[]> {
        return this._http.get<IGroupResponseModel[]>(`${this._apiUrl}/${username}/groups`);
    }
}
