import {IAttendanceMarkModel} from '../../models/journal/IAttendanceMark.model';

export interface IGetStudentAttendanceResponseModel {
    readonly username: string | null,
    readonly fullName: string | null,
    readonly startBalance: number,
    readonly expenses: number,
    readonly payments: number,
    readonly endBalance: number,
    readonly attendance: IAttendanceMarkModel[],
}
