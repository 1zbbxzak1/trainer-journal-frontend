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
import {CookieService} from 'ngx-cookie-service';

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

        CookieService,
        provideClientHydration(),
        {provide: LOCALE_ID, useValue: 'ru'},
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtTokenInterceptor,
            multi: true
        },
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
