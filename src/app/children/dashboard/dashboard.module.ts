import {NgModule} from '@angular/core';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {TeamsComponent} from './pages/teams/teams.component';
import {RouterLink, RouterLinkActive} from "@angular/router";


@NgModule({
    declarations: [
        SidebarComponent,
        TeamsComponent,
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
