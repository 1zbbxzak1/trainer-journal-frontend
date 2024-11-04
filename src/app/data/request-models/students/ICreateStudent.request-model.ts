export interface ParentInfo {
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
    readonly email: string,
    readonly phone: string,
    readonly firstParentInfo?: ParentInfo,
    readonly secondParentInfo?: ParentInfo,
}
