import {Component, Input} from '@angular/core';

@Component({
    selector: 'app-student-loading',
    templateUrl: './student-loading.component.html',
    styleUrl: './styles/student-loading.component.css'
})
export class StudentLoadingComponent {
    @Input()
    public isLoading: boolean = false;
}
