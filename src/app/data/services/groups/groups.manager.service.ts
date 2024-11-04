import {ErrorHandler, inject, Injectable} from '@angular/core';
import {GroupsService} from './groups.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IGetGroupResponseModel} from '../../response-models/groups/IGetGroup.response-model';
import {ICreateGroupRequestModel} from '../../request-models/groups/ICreateGroup.request-model';
import {IUpdateGroupInfoRequestModel} from '../../request-models/groups/IUpdateGroupInfoRequestModel';
import {IStudentItemResponseModel} from '../../response-models/students/IStudentItem.response-model';
import {ICreateStudentRequestModel} from '../../request-models/students/ICreateStudent.request-model';
import {ICreateStudentResponseModel} from '../../response-models/students/ICreateStudent.response-model';
import {IGroupResponseModel} from '../../response-models/groups/IGroup.response-model';

@Injectable()
export class GroupsManagerService {

    private readonly _groupService: GroupsService = inject(GroupsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getAllGroups(): Observable<IGetGroupResponseModel[]> {
        return this._groupService.getAllGroups().pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public createGroup(group: ICreateGroupRequestModel): Observable<IGroupResponseModel> {
        return this._groupService.createGroup(group).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getGroupById(id: string): Observable<IGroupResponseModel> {
        return this._groupService.getGroupById(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateGroupById(id: string, group: IUpdateGroupInfoRequestModel): Observable<IGroupResponseModel> {
        return this._groupService.updateGroupById(id, group).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public deleteGroupById(id: string): Observable<void> {
        return this._groupService.deleteGroupById(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getAllStudentsByIdGroup(id: string): Observable<IStudentItemResponseModel[]> {
        return this._groupService.getAllStudentsByIdGroup(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public createStudentByIdGroup(id: string, student: ICreateStudentRequestModel): Observable<ICreateStudentResponseModel> {
        return this._groupService.createStudentByIdGroup(id, student).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}