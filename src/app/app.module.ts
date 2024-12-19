import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthorizationModule} from './children/authorization/authorization.module';
import {DashboardModule} from './children/dashboard/dashboard.module';
import {AuthGuard} from './data/guards/auth.guard';
import {AuthService} from './data/services/auth/auth.service';
import {AuthManagerService} from './data/services/auth/auth.manager.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {JwtTokenInterceptor} from './interceptors/jwt-token.interceptor';
import {GroupsService} from './data/services/groups/groups.service';
import {GroupsManagerService} from './data/services/groups/groups.manager.service';
import {CookieService} from 'ngx-cookie-service';
import {StateBarService} from './children/services/state-bar/state-bar.service';
import {StudentsService} from './data/services/students/students.service';
import {StudentsManagerService} from './data/services/students/students.manager.service';
import {PopUpGroupService} from './children/services/groups/pop-up-group.service';
import {FormatterService} from './children/services/formatter/formatter.service';
import {ScheduleService} from './data/services/schedule/schedule.service';
import {ScheduleManagerService} from './data/services/schedule/schedule.manager.service';
import {ProfileService} from './data/services/profile/profile.service';
import {ProfileManagerService} from './data/services/profile/profile.manager.service';
import {JournalService} from './data/services/journal/journal.service';
import {JournalManagerService} from './data/services/journal/journal.manager.service';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,

        AuthorizationModule,
        DashboardModule,

        HttpClientModule,
    ],
    providers: [
        AuthGuard,
        AuthService,
        AuthManagerService,

        GroupsService,
        GroupsManagerService,
        PopUpGroupService,

        StudentsService,
        StudentsManagerService,

        ScheduleService,
        ScheduleManagerService,

        ProfileService,
        ProfileManagerService,

        JournalService,
        JournalManagerService,

        StateBarService,
        FormatterService,
        CookieService,
        provideClientHydration(),
        {provide: LOCALE_ID, useValue: 'ru'},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtTokenInterceptor,
            multi: true
        },
    ],
    exports: [],
    bootstrap: [AppComponent]
})

export class AppModule {
}
