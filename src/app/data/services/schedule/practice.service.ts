import {inject, Injectable} from '@angular/core';
import {environment} from '../../../../environments/environment';
import {Observable} from 'rxjs';
import {IPracticeModel} from '../../models/schedule/IPractice.model';
import {IChangePracticeRequestModel} from '../../request-models/schedule/IChangePractice.request-model';
import {ICancelPracticeRequestModel} from '../../request-models/schedule/ICancelPractice.request-model';
import {ICreateSinglePracticeRequestModel} from '../../request-models/schedule/ICreateSinglePractice.request-model';
import {HttpClient, HttpParams} from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class PracticeService {
    private readonly _apiUrl = `${environment.apiUrl}/schedule/practices`;

    private readonly _http: HttpClient = inject(HttpClient);

    // Создание одиночной практики
    createSinglePractice(request: ICreateSinglePracticeRequestModel): Observable<IPracticeModel> {
        return this._http.post<IPracticeModel>(this._apiUrl, request);
    }

    // Получение практики по ID
    getPractice(id: string, practiceDate: Date): Observable<IPracticeModel> {
        const params = new HttpParams().set('practiceDate', practiceDate.toISOString());
        return this._http.get<IPracticeModel>(`${this._apiUrl}/${id}`, {params});
    }

    // Отмена практики
    cancelPractice(id: string, request: ICancelPracticeRequestModel): Observable<IPracticeModel> {
        return this._http.post<IPracticeModel>(`${this._apiUrl}/${id}/cancel`, request);
    }

    // Возобновление практики
    resumePractice(id: string): Observable<IPracticeModel> {
        return this._http.post<IPracticeModel>(`${this._apiUrl}/${id}/resume`, {});
    }

    // Изменение практики
    changePractice(id: string, request: IChangePracticeRequestModel): Observable<IPracticeModel> {
        return this._http.put<IPracticeModel>(`${this._apiUrl}/${id}`, request);
    }
}
