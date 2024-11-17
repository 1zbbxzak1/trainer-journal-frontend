export interface ICreateGroupRequestModel {
    readonly name: string,
    readonly price: number,
    readonly hallAddress: string | null,
    readonly hexColor: string | null,
}
