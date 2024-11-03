import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthorizationModule} from './children/authorization/authorization.module';
import {AuthGuard} from './data/guards/auth.guard';
import {AuthService} from './data/services/auth/auth.service';
import {AuthManagerService} from './data/services/auth/auth.manager.service';
import {HttpClientModule} from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,

        AuthorizationModule,

        HttpClientModule,
    ],
    providers: [
        AuthGuard,
        AuthService,
        AuthManagerService,

        provideClientHydration(),
        {provide: LOCALE_ID, useValue: 'ru'},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
