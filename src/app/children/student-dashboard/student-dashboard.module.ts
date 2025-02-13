import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {StudentSidebarComponent} from './components/student-sidebar/student-sidebar.component';
import {StudentScheduleComponent} from './pages/student-schedule/student-schedule.component';
import {StudentGroupComponent} from './pages/student-group/student-group.component';
import {StudentProfileComponent} from './pages/student-profile/student-profile.component';
import {StudentChecksComponent} from './pages/student-checks/student-checks.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SendCheckComponent} from './pages/student-checks/components/send-check/send-check.component';
import {InfoCheckComponent} from './pages/student-checks/components/info-check/info-check.component';
import {DashboardModule} from "../dashboard/dashboard.module";
import {StudentLoadingComponent} from './components/student-loading/student-loading.component';


@NgModule({
    declarations: [
        StudentSidebarComponent,
        StudentLoadingComponent,

        StudentScheduleComponent,

        StudentGroupComponent,

        StudentProfileComponent,

        StudentChecksComponent,
        SendCheckComponent,
        InfoCheckComponent,
        StudentLoadingComponent,
    ],
    imports: [
        CommonModule,
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive,
        ReactiveFormsModule,
        FormsModule,
        DashboardModule
    ]
})
export class StudentDashboardModule {
}
