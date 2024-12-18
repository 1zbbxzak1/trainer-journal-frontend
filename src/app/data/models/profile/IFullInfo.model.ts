import {IUserInfoModel} from './IUserInfo.model';
import {ICredentialsModel} from './ICredentials.model';
import {IStudentInfoModel} from './IStudentInfo.model';
import {ITrainerInfoModel} from './ITrainerInfo.model';

export interface IFullInfoModel {
    readonly username: string,
    readonly userInfo?: IUserInfoModel,
    readonly credentials?: ICredentialsModel,
    readonly studentInfo?: IStudentInfoModel,
    readonly trainerInfo?: ITrainerInfoModel,
}
