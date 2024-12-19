import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {StudentSidebarComponent} from './components/student-sidebar/student-sidebar.component';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {ReactiveFormsModule} from '@angular/forms';


@NgModule({
    declarations: [
        StudentSidebarComponent,
    ],
    imports: [
        CommonModule,
        NgOptimizedImage,
        RouterLink,
        RouterLinkActive,
        ReactiveFormsModule
    ]
})
export class StudentDashboardModule {
}
