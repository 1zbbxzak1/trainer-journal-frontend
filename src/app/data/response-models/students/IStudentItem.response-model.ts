import {IContactsModel} from '../../models/students/IContacts.model';

export interface IStudentItemResponseModel {
    readonly username: string,
    readonly fullName: string,
    readonly balance: number,
    readonly age: number,
    readonly schoolGrade: number,
    readonly kyu: number | null,
    readonly gender: string,
    readonly groupIds: string[],
    readonly contact: IContactsModel,
}
