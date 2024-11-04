export interface IExtraContact {
    readonly name: string,
    readonly contact: string,
}


export interface ICreateStudentRequestModel {
    readonly fullName: string,
    readonly gender: string,
    readonly birthDate: Date,
    readonly schoolGrade: number,
    readonly kyu: number,
    readonly address: string,
    readonly extraContacts: IExtraContact[],
}
