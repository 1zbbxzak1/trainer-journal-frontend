import {inject, Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IPaymentReceiptResponseModel} from '../../response-models/checks/IPaymentReceipt.response-model';
import {IVerifyPaymentReceiptRequestModel} from '../../request-models/checks/IVerifyPaymentReceipt.request-model';

@Injectable()
export class ChecksService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _apiUrl: string = `${environment.apiUrl}/receipts`;

    public getReceiptById(id: string): Observable<IPaymentReceiptResponseModel> {
        return this._http.get<IPaymentReceiptResponseModel>(`${this._apiUrl}/${id}`);
    }

    public deleteReceiptById(id: string): Observable<IPaymentReceiptResponseModel> {
        return this._http.delete<IPaymentReceiptResponseModel>(`${this._apiUrl}/${id}`);
    }

    public updateReceipt(id: string, formData: FormData): Observable<IPaymentReceiptResponseModel> {
        return this._http.put<IPaymentReceiptResponseModel>(`${this._apiUrl}/${id}`, formData);
    }

    public getReceipts(verified: boolean | null = null): Observable<IPaymentReceiptResponseModel[]> {
        let params: HttpParams = new HttpParams();

        if (verified !== null) {
            params = params.set('verified', verified.toString());
        }

        return this._http.get<IPaymentReceiptResponseModel[]>(`${this._apiUrl}`, {params});
    }

    public uploadReceipt(formData: FormData): Observable<IPaymentReceiptResponseModel> {
        return this._http.post<IPaymentReceiptResponseModel>(this._apiUrl, formData);
    }

    public getReceiptByUsername(username: string, verified: boolean | null = null): Observable<IPaymentReceiptResponseModel[]> {
        let params: HttpParams = new HttpParams();

        if (verified !== null) {
            params = params.set('verified', verified.toString());
        }

        return this._http.get<IPaymentReceiptResponseModel[]>(`${this._apiUrl}/students/${username}`, {params});
    }

    public getReceiptsByGroupId(id: string): Observable<IPaymentReceiptResponseModel[]> {
        return this._http.get<IPaymentReceiptResponseModel[]>(`${this._apiUrl}/groups/${id}`);
    }

    public verifyReceipt(id: string, data: IVerifyPaymentReceiptRequestModel): Observable<IPaymentReceiptResponseModel> {
        return this._http.post<IPaymentReceiptResponseModel>(`${this._apiUrl}/${id}/verify`, data);
    }
}
