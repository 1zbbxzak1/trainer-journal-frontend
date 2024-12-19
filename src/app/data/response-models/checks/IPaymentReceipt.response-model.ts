export interface IPaymentReceiptResponseModel {
    readonly id: string,
    readonly student: IStudentShortDto,
    readonly amount: number,
    readonly imageUrl: string,
    readonly uploadDate: Date,
    readonly isVerified: boolean,
    readonly verificationDate: Date | null,
    readonly isAccepted: boolean,
    readonly declineComment: string | null,
}

export interface IStudentShortDto {
    readonly username: string,
    readonly fullName: string,
    readonly balance: number,
    readonly groupIds: string[] | null,
}
