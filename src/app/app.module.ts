import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule, provideClientHydration} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthGuard} from './data/guards/auth.guard';

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
    ],
    providers: [
        AuthGuard,
        provideClientHydration(),
        {provide: LOCALE_ID, useValue: 'ru'},
    ],
    bootstrap: [AppComponent]
})

export class AppModule {
}
