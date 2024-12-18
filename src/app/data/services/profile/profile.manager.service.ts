import {ErrorHandler, inject, Injectable} from '@angular/core';
import {ProfileService} from './profile.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IFullInfoModel} from '../../models/profile/IFullInfo.model';
import {IUpdateFullInfoRequestModel} from '../../request-models/profile/IUpdateFullInfo.request-model';
import {IFullInfoWithCredentialsModel} from '../../models/profile/IFullInfoWithCredentials.model';
import {IUpdateUserStudentInfoRequestModel} from '../../request-models/profile/IUpdateUserStudentInfo.request-model';

@Injectable()
export class ProfileManagerService {
    private readonly _profileService: ProfileService = inject(ProfileService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getInfoMe(): Observable<IFullInfoModel> {
        return this._profileService.getInfoMe().pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateInfoMe(info: IUpdateFullInfoRequestModel): Observable<IFullInfoWithCredentialsModel> {
        return this._profileService.updateInfoMe(info).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public getInfoUser(username: string): Observable<IFullInfoModel> {
        return this._profileService.getInfoUser(username).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }

    public updateInfoUser(username: string, info: IUpdateUserStudentInfoRequestModel): Observable<IFullInfoWithCredentialsModel> {
        return this._profileService.updateInfoUser(username, info).pipe(
            catchError(err => {
                this._errorHandler.handleError(err);
                return NEVER;
            }),
        );
    }
}
