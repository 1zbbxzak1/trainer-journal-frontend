import {Component} from '@angular/core';
import {StateBarService} from '../../../services/state-bar/state-bar.service';

@Component({
    selector: 'app-student-sidebar',
    templateUrl: './student-sidebar.component.html',
    styleUrl: './styles/student-sidebar.component.css'
})
export class StudentSidebarComponent extends StateBarService {

}
