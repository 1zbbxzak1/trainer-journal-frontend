import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {WelcomeComponent} from './welcome/welcome.component';


@NgModule({
    declarations: [
        WelcomeComponent,
    ],
    imports: [
        CommonModule
    ]
})
export class AuthorizationModule {
}
