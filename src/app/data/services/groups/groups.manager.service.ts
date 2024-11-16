import {ErrorHandler, inject, Injectable} from '@angular/core';
import {GroupsService} from './groups.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IGetGroupResponseModel} from '../../response-models/groups/IGetGroup.response-model';
import {ICreateGroupRequestModel} from '../../request-models/groups/ICreateGroup.request-model';
import {IUpdateGroupInfoRequestModel} from '../../request-models/groups/IUpdateGroupInfoRequestModel';
import {IStudentItemResponseModel} from '../../response-models/students/IStudentItem.response-model';
import {IGroupResponseModel} from '../../response-models/groups/IGroup.response-model';
import {IAddStudentRequestModel} from '../../request-models/students/IAddStudent.request-model';

@Injectable()
export class GroupsManagerService {

    private readonly _groupService: GroupsService = inject(GroupsService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getAllGroups(): Observable<IGetGroupResponseModel> {
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

    public getAllStudentsByGroup(id: string): Observable<IStudentItemResponseModel[]> {
        return this._groupService.getAllStudentsByGroup(id).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public AddStudentToGroup(id: string, student: IAddStudentRequestModel): Observable<void> {
        return this._groupService.addStudentToGroup(id, student).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        )
    }

    public excludeStudentFromGroup(id: string, username: string): Observable<void> {
        return this._groupService.excludeStudentFromGroup(id, username).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        )
    }
}
