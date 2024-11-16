import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {GroupsComponent} from './pages/groups/groups.component';
import {ScheduleComponent} from './pages/schedule/schedule.component';
import {RouterLink, RouterLinkActive} from "@angular/router";
import {ChecksComponent} from './pages/checks/checks.component';
import {ProfileComponent} from './pages/profile/profile.component';
import {JournalComponent} from './pages/journal/journal.component';
import {StudentsComponent} from './pages/students/students.component';


@NgModule({
    declarations: [
        SidebarComponent,
        GroupsComponent,
        JournalComponent,
        StudentsComponent,
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
