import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-loading',
    templateUrl: './loading.component.html',
    styleUrl: './styles/loading.component.css'
})
export class LoadingComponent {
    @Input()
    public isLoading: boolean = false;
}
