import {IContactsModel} from '../../models/students/IContacts.model';

export interface IUpdateStudentInfoRequestModel {
    readonly schoolGrade: number | null,
    readonly address: string | null,
    readonly kyu: number | null,
    readonly birthDate: Date | null,
    readonly contacts: IContactsModel[] | null,
}
