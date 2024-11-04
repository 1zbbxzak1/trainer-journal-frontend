export interface IGroupItem {
    readonly id: string,
    readonly name: string,
    readonly hexColor: string,
    readonly studentsCount: string,
}

export interface IGetGroupResponseModel {
    readonly studentCount: number,
    readonly groups: IGroupItem[],
}
