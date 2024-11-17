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
import {GroupPopUpComponent} from './pages/groups/components/group-pop-up/group-pop-up.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { DeletePopUpComponent } from './pages/groups/components/delete-pop-up/delete-pop-up.component';
import { GroupDetailsComponent } from './pages/groups/children/group-details/group-details.component';


@NgModule({
    declarations: [
        SidebarComponent,
        GroupsComponent,
        JournalComponent,
        StudentsComponent,
        ScheduleComponent,
        ChecksComponent,
        ProfileComponent,
        GroupPopUpComponent,
        DeletePopUpComponent,
        GroupDetailsComponent,
    ],
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        NgOptimizedImage,
        FormsModule,
        ReactiveFormsModule
    ]
})
export class DashboardModule {
}
