import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {from, map, Observable, of} from "rxjs";
import {inject} from "@angular/core";

export class AuthGuard {

    private readonly _router: Router = inject(Router);

    public canActivate(router: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
        const isAuthorized: string | null = localStorage.getItem("token");

        if (state.url === '/auth') {
            if (isAuthorized !== null) {
                from(this._router.navigate(["dashboard/teams"])).pipe(
                    map((): boolean => false)
                );
            }
            return of(true);
        } else {
            if (isAuthorized === null) {
                from(this._router.navigate(["auth"])).pipe(
                    map((): boolean => false)
                );
            }
            return of(true);
        }
    }
}
