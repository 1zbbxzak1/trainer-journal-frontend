import {IContactsModel} from '../students/IContacts.model';

export interface IStudentInfoModel {
    readonly birthDate: string,
    readonly age: number,
    readonly schoolGrade: number,
    readonly kyu?: number | null,
    readonly kyuUpdatedAt?: string | null,
    readonly trainingStartDate: string,
    readonly address: string,
    readonly balance: number,
    readonly contacts: IContactsModel[],
}
