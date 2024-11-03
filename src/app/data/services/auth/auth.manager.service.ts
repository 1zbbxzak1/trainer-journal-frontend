import {ErrorHandler, inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {IAuthRequestModel} from '../../request-models/auth/IAuth.request-model';
import {catchError, map, NEVER, Observable} from 'rxjs';
import {IAuthResponseModel} from '../../response-models/auth/IAuth.response-model';

@Injectable()
export class AuthManagerService {

    private readonly _authService: AuthService = inject(AuthService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);
    private _token: string | null = null;

    public loginUser(user: IAuthRequestModel): Observable<boolean> {
        return this._authService.loginUser(user).pipe(
            map((user: IAuthResponseModel): boolean => {
                this._token = user.token;
                localStorage.setItem("token", user.token);
                return true;
            }),
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public logout(): void {
        this._token = null;
        localStorage.removeItem('token');
    }
}
