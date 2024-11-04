import {ActivatedRouteSnapshot, RouterStateSnapshot, Routes} from '@angular/router';
import {AuthGuard} from './data/guards/auth.guard';
import {inject} from '@angular/core';
import {AuthComponent} from './children/authorization/pages/auth/auth.component';
import {TeamsComponent} from './children/dashboard/pages/teams/teams.component';
import {ScheduleComponent} from './children/dashboard/pages/schedule/schedule.component';
import {ChecksComponent} from './children/dashboard/pages/checks/checks.component';
import {ProfileComponent} from './children/dashboard/pages/profile/profile.component';

export const routes: Routes = [
    {path: '', redirectTo: 'dashboard/teams', pathMatch: 'full'},
    {
        path: 'auth',
        component: AuthComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/schedule',
        component: ScheduleComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/teams',
        component: TeamsComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/checks',
        component: ChecksComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/profile',
        component: ProfileComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
];
