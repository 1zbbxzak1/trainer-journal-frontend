import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TeamsComponent} from './pages/teams/teams.component';


@NgModule({
    declarations: [
        TeamsComponent,
    ],
    imports: [
        CommonModule
    ]
})
export class DashboardModule {
}
