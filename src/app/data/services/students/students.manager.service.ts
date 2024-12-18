import {ErrorHandler, inject, Injectable} from '@angular/core';
import {StudentsService} from './students.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IStudentItemResponseModel} from '../../response-models/students/IStudentItem.response-model';
import {ICreateStudentRequestModel} from '../../request-models/students/ICreateStudent.request-model';
import {ICreateStudentResponseModel} from '../../response-models/students/ICreateStudent.response-model';
import {IGroupResponseModel} from '../../response-models/groups/IGroup.response-model';

@Injectable()
export class StudentsManagerService {
    private readonly _studentsService: StudentsService = inject(StudentsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getStudents(withGroup: boolean | null = null): Observable<IStudentItemResponseModel[]> {
        return this._studentsService.getStudents(withGroup).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public createStudentInGroup(student: ICreateStudentRequestModel): Observable<ICreateStudentResponseModel> {
        return this._studentsService.createStudentInGroup(student).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getStudentGroups(username: string): Observable<IGroupResponseModel[]> {
        return this._studentsService.getStudentGroups(username).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
