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
import {JournalDetailsComponent} from './pages/journal/children/journal-details/journal-details.component';
import {
    CreateStudentPopUpComponent
} from './pages/groups/components/create-student-pop-up/create-student-pop-up.component';
import {StudentProfileGroupComponent} from './pages/groups/children/student-profile/student-profile-group.component';
import {ChecksDetailsComponent} from './pages/checks/children/checks-details/checks-details.component';
import {EditAmountComponent} from './pages/checks/components/edit-amount/edit-amount.component';
import {DeclineCommentComponent} from './pages/checks/components/decline-comment/decline-comment.component';
import {CheckInfoComponent} from './pages/checks/components/check-info/check-info.component';
import {
    UpdateStudentInfoComponent
} from './pages/groups/children/student-profile/components/update-student-info/update-student-info.component';
import {PracticeInfoComponent} from './pages/schedule/components/practice-info/practice-info.component';
import {
    PracticeAttendanceComponent
} from './pages/schedule/components/practice-attendance/practice-attendance.component';
import {LoadingComponent} from './components/loading/loading.component';
import {PracticeCreateComponent} from './pages/schedule/components/practice-create/practice-create.component';


@NgModule({
    declarations: [
        SidebarComponent,
        LoadingComponent,

        GroupsComponent,
        GroupDetailsComponent,

        JournalComponent,
        JournalDetailsComponent,

        StudentsComponent,

        ScheduleComponent,
        PracticeCreateComponent,
        PracticeInfoComponent,
        PracticeAttendanceComponent,

        ChecksComponent,
        ChecksDetailsComponent,
        EditAmountComponent,
        DeclineCommentComponent,
        CheckInfoComponent,

        ProfileComponent,

        GroupPopUpComponent,
        DeletePopUpComponent,

        CreateStudentPopUpComponent,
        AddStudentPopUpComponent,
        LoginDetailsPopUpComponent,
        AddStudentsPopUpComponent,
        StudentProfileGroupComponent,
        UpdateStudentInfoComponent,
    ],
    exports: [],
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
