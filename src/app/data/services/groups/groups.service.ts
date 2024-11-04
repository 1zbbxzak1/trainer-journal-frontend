import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IGetGroupResponseModel} from '../../response-models/groups/IGetGroup.response-model';
import {ICreateGroupRequestModel} from '../../request-models/groups/ICreateGroup.request-model';
import {IUpdateGroupInfoRequestModel} from '../../request-models/groups/IUpdateGroupInfoRequestModel';
import {IStudentItemResponseModel} from '../../response-models/students/IStudentItem.response-model';
import {ICreateStudentRequestModel} from '../../request-models/students/ICreateStudent.request-model';
import {ICreateStudentResponseModel} from '../../response-models/students/ICreateStudent.response-model';
import {IGroupResponseModel} from '../../response-models/groups/IGroup.response-model';

@Injectable()
export class GroupsService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}/groups`;

    public getAllGroups(): Observable<IGetGroupResponseModel[]> {
        return this._http.get<IGetGroupResponseModel[]>(`${this._apiUrl}`);
    }

    public createGroup(group: ICreateGroupRequestModel): Observable<IGroupResponseModel> {
        return this._http.post<IGroupResponseModel>(`${this._apiUrl}`, group);
    }

    public getGroupById(id: string): Observable<IGroupResponseModel> {
        return this._http.get<IGroupResponseModel>(`${this._apiUrl}/${id}`);
    }

    public updateGroupById(id: string, group: IUpdateGroupInfoRequestModel): Observable<IGroupResponseModel> {
        return this._http.put<IGroupResponseModel>(`${this._apiUrl}/${id}`, group);
    }

    public deleteGroupById(id: string): Observable<any> {
        return this._http.delete(`${this._apiUrl}/${id}`);
    }

    public getAllStudentsByIdGroup(id: string): Observable<IStudentItemResponseModel[]> {
        return this._http.get<IStudentItemResponseModel[]>(`${this._apiUrl}/${id}/students`);
    }

    public createStudentByIdGroup(id: string, student: ICreateStudentRequestModel): Observable<ICreateStudentResponseModel> {
        return this._http.post<ICreateStudentResponseModel>(`${this._apiUrl}/${id}/students`, student);
    }
}
