import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {IAuthRequestModel} from '../../request-models/auth/IAuth.request-model';
import {catchError, map, Observable, throwError} from 'rxjs';
import {IAuthResponseModel} from '../../response-models/auth/IAuth.response-model';

@Injectable()
export class AuthManagerService {

    private readonly _authService: AuthService = inject(AuthService);
    private _token: string | null = null;

    public loginUser(user: IAuthRequestModel): Observable<boolean> {
        return this._authService.loginUser(user).pipe(
            map((user: IAuthResponseModel): boolean => {
                this._token = user.token;
                localStorage.setItem("token", user.token);
                return true;
            }),
            catchError(err => {
                return this.handleLoginError(err);
            })
        );
    }

    public logout(): void {
        this._token = null;
        localStorage.removeItem('token');
    }

    private handleLoginError(err: any): Observable<never> {
        const errorMessage: string = this.getErrorMessage(err);
        return throwError(() => new Error(errorMessage));
    }

    private getErrorMessage(err: any): string {
        if (err.status == 404) {
            return "Ошибка. Неправильный логин и/или пароль.";
        }
        return "Произошла ошибка. Попробуйте еще раз.";
    }
}
