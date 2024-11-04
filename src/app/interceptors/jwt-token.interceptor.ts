import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {inject, Injectable} from '@angular/core';
import {catchError, Observable, throwError} from 'rxjs';
import {AuthManagerService} from '../data/services/auth/auth.manager.service';

@Injectable()
export class JwtTokenInterceptor implements HttpInterceptor {
    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Получаем токен из AuthManagerService
        const accessToken: string | null = this._authManagerService.getAccessToken();

        // Если токен существует, добавляем его к заголовку Authorization
        const authReq: HttpRequest<any> = accessToken
            ? req.clone({headers: req.headers.set('Authorization', `Bearer ${accessToken}`)})
            : req;

        // Обрабатываем запрос и ловим ошибки
        return next.handle(authReq).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) {
                    // Если статус 401, токен просрочен или отсутствует — перенаправляем на логин
                    this._authManagerService.logout(); // Вызываем метод выхода
                }
                return throwError(() => new Error(error.message)); // Передаем ошибку дальше
            })
        );
    }
}
