import {IContactsModel} from '../../models/students/IContacts.model';

export interface ICreateStudentRequestModel {
    readonly fullName: string,
    readonly gender: string,
    readonly birthDate: Date,
    readonly schoolGrade: number,
    readonly kyu: number | null,
    readonly address: string | null,
    readonly groupIds: string[],
    readonly contacts: IContactsModel[],
}
