import {ErrorHandler, inject, Injectable} from '@angular/core';
import {StudentsService} from './students.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IStudentItemResponseModel} from '../../response-models/students/IStudentItem.response-model';
import {ICreateStudentRequestModel} from '../../request-models/students/ICreateStudent.request-model';
import {ICreateStudentResponseModel} from '../../response-models/students/ICreateStudent.response-model';
import {IGroupResponseModel} from '../../response-models/groups/IGroup.response-model';
import {IGetStudentBalanceResposeModel} from '../../response-models/students/IGetStudentBalance.respose-model';
import {IBalanceChangeResponseModel} from '../../response-models/students/IBalanceChange.response-model';

@Injectable()
export class StudentsManagerService {
    private readonly _studentsService: StudentsService = inject(StudentsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getStudents(withGroup: boolean): Observable<IStudentItemResponseModel[]> {
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

    public getBalanceChanges(username: string, start: Date, end: Date): Observable<IGetStudentBalanceResposeModel[]> {
        return this._studentsService.getBalanceChanges(username, start, end).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getBalanceChangesReport(username: string, start: Date, end: Date): Observable<IBalanceChangeResponseModel> {
        return this._studentsService.getBalanceChangesReport(username, start, end).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getCurrentMonthBalanceChangesReport(username: string): Observable<IBalanceChangeResponseModel> {
        const now = new Date();

        // Start of the current month
        const start = new Date(now.getFullYear(), now.getMonth(), 1);

        // End of the current month
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59);

        return this._studentsService.getBalanceChangesReport(username, start, end).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
