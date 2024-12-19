import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IPaymentReceiptResponseModel} from '../../response-models/checks/IPaymentReceipt.response-model';

@Injectable()
export class ChecksService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}/receipts`;

    public uploadReceipt(formData: FormData): Observable<IPaymentReceiptResponseModel> {
        return this._http.post<IPaymentReceiptResponseModel>(this._apiUrl, formData);
    }

    public getReceipt(username: string, verified: boolean | null = null): Observable<IPaymentReceiptResponseModel[]> {
        let params = new HttpParams();

        if (verified !== null) {
            params = params.set('verified', verified.toString());
        }

        return this._http.get<IPaymentReceiptResponseModel[]>(`${this._apiUrl}/students/${username}`, {params});
    }
}
