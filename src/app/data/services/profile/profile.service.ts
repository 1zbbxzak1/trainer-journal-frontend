import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IFullInfoModel} from '../../models/profile/IFullInfo.model';
import {IUpdateFullInfoRequestModel} from '../../request-models/profile/IUpdateFullInfo.request-model';
import {IFullInfoWithCredentialsModel} from '../../models/profile/IFullInfoWithCredentials.model';
import {IUpdateUserStudentInfoRequestModel} from '../../request-models/profile/IUpdateUserStudentInfo.request-model';

@Injectable()
export class ProfileService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrlMe: string = `${environment.apiUrl}/me`;
    private readonly _apiUrlUsers: string = `${environment.apiUrl}/users`;

    public getInfoMe(): Observable<IFullInfoModel> {
        return this._http.get<IFullInfoModel>(`${this._apiUrlMe}`);
    }

    public updateInfoMe(info: IUpdateFullInfoRequestModel): Observable<IFullInfoWithCredentialsModel> {
        return this._http.put<IFullInfoWithCredentialsModel>(`${this._apiUrlMe}`, info);
    }

    public getInfoUser(username: string): Observable<IFullInfoModel> {
        return this._http.get<IFullInfoModel>(`${this._apiUrlUsers}/${username}`);
    }

    public updateInfoUser(username: string, info: IUpdateUserStudentInfoRequestModel): Observable<IFullInfoWithCredentialsModel> {
        return this._http.put<IFullInfoWithCredentialsModel>(`${this._apiUrlUsers}/${username}`, info);
    }
}
