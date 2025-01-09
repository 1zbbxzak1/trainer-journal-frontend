import {ErrorHandler, inject, Injectable} from '@angular/core';
import {ChecksService} from './checks.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IPaymentReceiptResponseModel} from '../../response-models/checks/IPaymentReceipt.response-model';
import {IVerifyPaymentReceiptRequestModel} from '../../request-models/checks/IVerifyPaymentReceipt.request-model';

@Injectable()
export class ChecksManagerService {
    private readonly _checksService: ChecksService = inject(ChecksService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public getReceiptById(id: string): Observable<IPaymentReceiptResponseModel> {
        return this._checksService.getReceiptById(id).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public deleteReceiptById(id: string): Observable<IPaymentReceiptResponseModel> {
        return this._checksService.deleteReceiptById(id).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public updateReceipt(id: string, formData: FormData): Observable<IPaymentReceiptResponseModel> {
        return this._checksService.updateReceipt(id, formData).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public getReceipts(verified: boolean | null = null): Observable<IPaymentReceiptResponseModel[]> {
        return this._checksService.getReceipts(verified).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public uploadReceipt(formData: FormData): Observable<IPaymentReceiptResponseModel> {
        return this._checksService.uploadReceipt(formData).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public getReceiptByUsername(username: string, verified: boolean | null = null): Observable<IPaymentReceiptResponseModel[]> {
        return this._checksService.getReceiptByUsername(username, verified).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public getReceiptsByGroupId(id: string): Observable<IPaymentReceiptResponseModel[]> {
        return this._checksService.getReceiptsByGroupId(id).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public verifyReceipt(id: string, data: IVerifyPaymentReceiptRequestModel): Observable<IPaymentReceiptResponseModel> {
        return this._checksService.verifyReceipt(id, data).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }
}
