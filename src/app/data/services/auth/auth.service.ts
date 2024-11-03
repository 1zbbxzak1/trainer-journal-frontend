import {inject, Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {IAuthRequestModel} from '../../request-models/auth/IAuth.request-model';
import {Observable} from 'rxjs';
import {IAuthResponseModel} from '../../response-models/auth/IAuth.response-model';

@Injectable()
export class AuthService {

    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}/auth/login`;

    public loginUser(user: IAuthRequestModel): Observable<IAuthResponseModel> {
        return this._http.post<IAuthResponseModel>(`${this._apiUrl}`, user);
    }
}
