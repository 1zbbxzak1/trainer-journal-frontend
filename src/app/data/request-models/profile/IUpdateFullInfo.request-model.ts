import {IUpdateUserInfoModel} from '../../models/profile/IUpdateUserInfo.model';
import {IUpdateStudentInfoModel} from '../../models/profile/IUpdateStudentInfo.model';
import {IUpdateTrainerInfoRequestModel} from './IUpdateTrainerInfo.request-model';

export interface IUpdateFullInfoRequestModel {
    readonly userInfo?: IUpdateUserInfoModel,
    readonly studentInfo?: IUpdateStudentInfoModel,
    readonly trainerInfo?: IUpdateTrainerInfoRequestModel,
}
