import {IGroupItemModel} from '../../models/groups/IGroupItem.model';

export interface IGetGroupResponseModel {
    readonly studentsCount: number,
    readonly groups: IGroupItemModel[],
}
