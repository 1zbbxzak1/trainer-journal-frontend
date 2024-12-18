import {IUpdateUserInfoModel} from '../../models/profile/IUpdateUserInfo.model';
import {IUpdateStudentInfoModel} from '../../models/profile/IUpdateStudentInfo.model';

export interface IUpdateUserStudentInfoRequestModel {
    readonly userInfo?: IUpdateUserInfoModel,
    readonly studentInfo?: IUpdateStudentInfoModel,
}
