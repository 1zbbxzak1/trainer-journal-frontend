import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {AuthManagerService} from '../services/auth/auth.manager.service';

export class AuthGuard {

    private readonly _router: Router = inject(Router);
    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);

    public canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const isAuthorized: string | null = this._authManagerService.getAccessToken();
        const roles = this._authManagerService.getUserRoles();

        if (state.url === '/auth') {
            if (isAuthorized) {
                if (roles?.includes('Trainer') || roles?.includes('Admin')) {
                    this._router.navigate(["dashboard/groups"]);
                    return of(false);
                } else if (roles?.includes('User')) {
                    this._router.navigate(["student-dashboard/profile"]);
                    return of(false);
                }
            }
            return of(true);
        }

        if (!isAuthorized) {
            this._router.navigate(["auth"]);
            return of(false);
        }

        if (roles?.includes('User') && state.url.startsWith('/dashboard')) {
            // Если студент пытается попасть на страницу тренера, перенаправляем его на страницу студента
            this._router.navigate(["student-dashboard/profile"]);
            return of(false);
        }

        if ((roles?.includes('Trainer') || roles?.includes('Admin')) && state.url.startsWith('/student-dashboard')) {
            // Если тренер или администратор пытается попасть на страницу студента, перенаправляем его на страницы для тренеров
            this._router.navigate(["dashboard/groups"]);
            return of(false);
        }

        // Если все проверки пройдены, разрешаем доступ
        return of(true);
    }
}
