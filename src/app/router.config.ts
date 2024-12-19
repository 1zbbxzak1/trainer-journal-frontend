import {ActivatedRouteSnapshot, RouterStateSnapshot, Routes} from '@angular/router';
import {AuthGuard} from './data/guards/auth.guard';
import {inject} from '@angular/core';
import {AuthComponent} from './children/authorization/pages/auth/auth.component';
import {GroupsComponent} from './children/dashboard/pages/groups/groups.component';
import {ScheduleComponent} from './children/dashboard/pages/schedule/schedule.component';
import {ChecksComponent} from './children/dashboard/pages/checks/checks.component';
import {ProfileComponent} from './children/dashboard/pages/profile/profile.component';
import {JournalComponent} from './children/dashboard/pages/journal/journal.component';
import {StudentsComponent} from './children/dashboard/pages/students/students.component';
import {GroupDetailsComponent} from './children/dashboard/pages/groups/children/group-details/group-details.component';
import {
    JournalDetailsComponent
} from './children/dashboard/pages/journal/children/journal-details/journal-details.component';
import {StudentProfileComponent} from './children/student-dashboard/pages/student-profile/student-profile.component';
import {StudentScheduleComponent} from './children/student-dashboard/pages/student-schedule/student-schedule.component';

export const routes: Routes = [
    {path: '', redirectTo: 'dashboard/groups', pathMatch: 'full'},
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
        path: 'dashboard/groups',
        component: GroupsComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/groups/group-details/:id',
        component: GroupDetailsComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/journal',
        component: JournalComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/journal/journal-details/:id',
        component: JournalDetailsComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'dashboard/students',
        component: StudentsComponent,
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
    {
        path: 'student-dashboard/profile',
        component: StudentProfileComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
    {
        path: 'student-dashboard/schedule',
        component: StudentScheduleComponent,
        canActivate: [(router: ActivatedRouteSnapshot, state: RouterStateSnapshot) => inject(AuthGuard).canActivate(router, state)],
    },
];
