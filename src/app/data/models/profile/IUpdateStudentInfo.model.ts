import {IContactsModel} from '../students/IContacts.model';

export interface IUpdateStudentInfoModel {
    readonly schoolGrade?: number | null,
    readonly address?: string | null,
    readonly kyu?: number | null,
    readonly birthDate?: string | null,
    readonly contacts?: IContactsModel[],
}
