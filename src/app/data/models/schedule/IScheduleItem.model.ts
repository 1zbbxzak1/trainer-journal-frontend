import {ColorGroup} from '../../../children/dashboard/pages/schedule/types/types-color';

export interface IScheduleItemModel {
    readonly id: string,
    readonly start: string,
    readonly end: string,
    readonly groupName: string,
    readonly hallAddress?: string | null,
    readonly practiceType: string,
    readonly price?: number,
    readonly isCanceled: boolean,
    colorKey: ColorGroup;
}
