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
import {DeletePopUpComponent} from './pages/groups/components/delete-pop-up/delete-pop-up.component';
import {GroupDetailsComponent} from './pages/groups/children/group-details/group-details.component';
import {AddStudentPopUpComponent} from './pages/groups/components/add-student-pop-up/add-student-pop-up.component';
import {
    LoginDetailsPopUpComponent
} from './pages/groups/components/login-details-pop-up/login-details-pop-up.component';
import {AddStudentsPopUpComponent} from './pages/groups/components/add-students-pop-up/add-students-pop-up.component';
import {
    CreateStudentPopUpComponent
} from './pages/groups/components/create-student-pop-up/create-student-pop-up.component';


@NgModule({
    declarations: [
        SidebarComponent,

        GroupsComponent,
        GroupDetailsComponent,

        JournalComponent,

        StudentsComponent,

        ScheduleComponent,

        ChecksComponent,

        ProfileComponent,

        GroupPopUpComponent,
        DeletePopUpComponent,

        CreateStudentPopUpComponent,
        AddStudentPopUpComponent,
        LoginDetailsPopUpComponent,
        AddStudentsPopUpComponent,
    ],
    imports: [
        CommonModule,
        RouterLink,
        RouterLinkActive,
        NgOptimizedImage,
        FormsModule,
        ReactiveFormsModule,
    ]
})
export class DashboardModule {
}
