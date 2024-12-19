import {ErrorHandler, inject, Injectable} from '@angular/core';
import {ChecksService} from './checks.service';
import {catchError, NEVER, Observable} from 'rxjs';
import {IPaymentReceiptResponseModel} from '../../response-models/checks/IPaymentReceipt.response-model';

@Injectable()
export class ChecksManagerService {
    private readonly _checksService: ChecksService = inject(ChecksService);
    private readonly _errorHandler: ErrorHandler = inject(ErrorHandler);

    public uploadReceipt(formData: FormData): Observable<IPaymentReceiptResponseModel> {
        return this._checksService.uploadReceipt(formData).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }

    public getReceipt(username: string, verified: boolean | null = null): Observable<IPaymentReceiptResponseModel[]> {
        return this._checksService.getReceipt(username, verified).pipe(
            catchError((err) => {
                this._errorHandler.handleError(err);
                return NEVER;
            })
        );
    }
}
