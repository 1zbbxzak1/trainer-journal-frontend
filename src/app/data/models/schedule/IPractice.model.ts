import {IPracticeGroupModel} from './IPracticeGroup.model';
import {IPracticeTrainerModel} from './IPracticeTrainer.model';

export interface IPracticeModel {
    readonly id: string,
    readonly state: string,
    readonly start: string,
    readonly end: string,
    readonly group: IPracticeGroupModel,
    readonly trainer: IPracticeTrainerModel,
    readonly practiceType: string,
    readonly hallAddress: string,
    readonly price: number,
    readonly isCanceled: boolean,
    readonly cancelComment: string | null,
}
