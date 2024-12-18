import {ICreateSchedulePracticeRequestModel} from './ICreateSchedulePractice.request-model';

export interface ICreateScheduleRequestModel {
    readonly startDay: string,
    readonly until: string,
    readonly practices: ICreateSchedulePracticeRequestModel[],
}
