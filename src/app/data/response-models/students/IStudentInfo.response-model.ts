import {IContactsModel} from '../../models/students/IContacts.model';

export interface IStudentInfoResponseModel {
    readonly birthDate: Date,
    readonly age: number,
    readonly schoolGrade: number,
    readonly kyu: number | null,
    readonly kyuUpdatedAt: Date | null,
    readonly trainingStartDate: Date,
    readonly address: string,
    readonly balance: number,
    readonly contacts: IContactsModel,
}
