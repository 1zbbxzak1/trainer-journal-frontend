import {ColorKey} from '../../../children/dashboard/pages/schedule/types/types-color';

export interface IGroupItemModel {
    readonly id: string,
    readonly name: string,
    readonly hallAddress: string,
    readonly hexColor: string,
    readonly studentsCount: number,
    readonly price: number,
    readonly colorKey: ColorKey;
}
