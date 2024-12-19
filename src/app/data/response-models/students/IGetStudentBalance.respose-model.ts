export interface IGetStudentBalanceResposeModel {
    readonly amount: number,
    readonly previousBalance: number,
    readonly afterBalance: number,
    readonly reason: string,
    readonly date: Date,
}
