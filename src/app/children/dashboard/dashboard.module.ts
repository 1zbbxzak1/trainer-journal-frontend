import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TeamsComponent} from './pages/teams/teams.component';
import {ScheduleComponent} from './pages/schedule/schedule.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ChecksComponent} from './pages/checks/checks.component';
import {ProfileComponent} from './pages/profile/profile.component';


@NgModule({
    declarations: [
        SidebarComponent,
        TeamsComponent,
        ScheduleComponent,
        ChecksComponent,
        ProfileComponent,
    ],
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        NgOptimizedImage
    ]
})
export class DashboardModule {
}
