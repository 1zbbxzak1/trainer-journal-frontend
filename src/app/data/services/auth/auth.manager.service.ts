import {inject, Injectable} from '@angular/core';
import {AuthService} from './auth.service';
import {IAuthRequestModel} from '../../request-models/auth/IAuth.request-model';
import {catchError, map, Observable, throwError} from 'rxjs';
import {IAuthResponseModel} from '../../response-models/auth/IAuth.response-model';
import {Router} from '@angular/router';
import {environment} from '../../../../environments/environment';
import {CookieService} from 'ngx-cookie-service';

@Injectable()
export class AuthManagerService {

    private readonly _authService: AuthService = inject(AuthService);
    private readonly _router: Router = inject(Router);
    private readonly _cookieService: CookieService = inject(CookieService);

    public loginUser(user: IAuthRequestModel): Observable<boolean> {
        return this._authService.loginUser(user).pipe(
            map((response: IAuthResponseModel): boolean => {
                this.setAccessToken(response.token); // Сохраняем токен в куки
                this.setLoginTimestamp(Date.now()); // Сохраняем время логина в куки
                this.startTokenExpirationCheck(); // Запускаем проверку срока действия токена
                return true;
            }),
            catchError(err => {
                return this.handleLoginError(err);
            })
        );
    }

    // Метод для logout
    public logout(): void {
        this.removeAccessToken(); // Удаляем токен из куки
        this.removeLoginTimestamp(); // Удаляем время логина
        this._router.navigate(['auth']); // Перенаправляем на страницу логина
    }

    // Метод для получения токена из приватного замыкания
    public getAccessToken(): string | null {
        const accessToken: string = this._cookieService.get(environment.TOKEN_NAME);
        if (accessToken && this.isTokenExpired()) {
            this.logout(); // Если токен истек, выполняем logout
            return null;
        }
        return accessToken || null;
    }

    // Проверка истечения срока действия токена
    private isTokenExpired(): boolean {
        const loginTimestamp: number | null = this.getLoginTimestamp();
        if (!loginTimestamp) return true;
        const currentTime: number = Date.now();
        return currentTime - loginTimestamp > environment.TOKEN_LIFESPAN;
    }

    // Запускаем проверку истечения токена через setTimeout
    private startTokenExpirationCheck(): void {
        const timeRemaining: number = environment.TOKEN_LIFESPAN - (Date.now() - (this.getLoginTimestamp() || 0));
        setTimeout((): void => {
            if (this.isTokenExpired()) {
                this.logout();
                alert("Ваша сессия истекла. Пожалуйста, войдите снова.");
            }
        }, timeRemaining);
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

    // Методы для работы с куками
    private setAccessToken(token: string): void {
        this._cookieService.set(environment.TOKEN_NAME, token, {expires: 1}); // Токен будет храниться 1 день
    }

    private removeAccessToken(): void {
        this._cookieService.delete(environment.TOKEN_NAME);
    }

    private getLoginTimestamp(): number | null {
        const timestamp: string = this._cookieService.get(environment.LOGIN_TIMESTAMP_NAME);
        return timestamp ? parseInt(timestamp, 10) : null;
    }

    private setLoginTimestamp(timestamp: number): void {
        this._cookieService.set(environment.LOGIN_TIMESTAMP_NAME, timestamp.toString(), {expires: 1}); // Время логина будет храниться 1 день
    }

    private removeLoginTimestamp(): void {
        this._cookieService.delete(environment.LOGIN_TIMESTAMP_NAME);
    }
}
