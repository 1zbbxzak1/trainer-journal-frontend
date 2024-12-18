export interface ICreateSinglePracticeRequestModel {
    readonly groupId: string;
    readonly start: string,
    readonly end: string,
    readonly practiceType: string,
    readonly hallAddress: string | null,
    readonly price: number | null,
}
