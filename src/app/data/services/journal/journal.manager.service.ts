import {ErrorHandler, inject, Injectable} from '@angular/core';
import {JournalService} from './journal.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IGetStudentAttendanceResponseModel} from '../../response-models/journal/IGetStudentAttendance.response-model';
import {IAttendanceMarkModel} from '../../models/journal/IAttendanceMark.model';
import {IGetPracticeAttendanceResponseModel} from '../../response-models/journal/IGetPracticeAttendance.response-model';
import {IMarkPracticeAttendanceRequestModel} from '../../request-models/journal/IMarkPracticeAttendance.request-model';

@Injectable()
export class JournalManagerService {
    private readonly _journalService: JournalService = inject(JournalService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getGroupAttendance(id: string, start: Date, end?: Date): Observable<IGetStudentAttendanceResponseModel[]> {
        return this._journalService.getGroupAttendance(id, start, end).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getStudentAttendance(username: string, start: Date, end?: Date): Observable<IAttendanceMarkModel[]> {
        return this._journalService.getStudentAttendance(username, start, end).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public markAttendance(username: string, request: IAttendanceMarkModel): Observable<IAttendanceMarkModel | null> {
        return this._journalService.markAttendance(username, request).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public unmarkAttendance(username: string, request: IAttendanceMarkModel): Observable<IAttendanceMarkModel | null> {
        return this._journalService.unmarkAttendance(username, request).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getPracticeAttendance(practiceId: string, practiceStart: Date): Observable<IGetPracticeAttendanceResponseModel[]> {
        return this._journalService.getPracticeAttendance(practiceId, practiceStart).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public markPracticeAttendance(practiceId: string, request: IMarkPracticeAttendanceRequestModel): Observable<void> {
        return this._journalService.markPracticeAttendance(practiceId, request).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
