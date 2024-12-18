export interface IChangePracticeRequestModel {
    readonly practiceStart: string,
    readonly groupId: string,
    readonly newStart: string,
    readonly newEnd: string,
    readonly practiceType: string,
    readonly price: number,
}
