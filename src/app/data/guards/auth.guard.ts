import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {Observable, of} from "rxjs";
import {inject} from "@angular/core";
import {AuthManagerService} from '../services/auth/auth.manager.service';

export class AuthGuard {

    private readonly _router: Router = inject(Router);
    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);

    public canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const isAuthorized: string | null = this._authManagerService.getAccessToken();

        if (state.url === '/auth') {
            if (isAuthorized) {
                this._router.navigate(["dashboard/teams"]);
                return of(false);
            }
            return of(true);
        } else {
            if (!isAuthorized) {
                this._router.navigate(["auth"]);
                return of(false);
            }
            return of(true);
        }
    }
}
