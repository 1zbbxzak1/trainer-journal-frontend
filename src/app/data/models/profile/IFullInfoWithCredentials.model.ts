import {IUserInfoModel} from './IUserInfo.model';
import {IStudentInfoModel} from './IStudentInfo.model';
import {ITrainerInfoModel} from './ITrainerInfo.model';

export interface IFullInfoWithCredentialsModel {
    readonly username?: string | null,
    readonly userInfo?: IUserInfoModel,
    readonly studentInfo?: IStudentInfoModel,
    readonly trainerInfo?: ITrainerInfoModel,
}
