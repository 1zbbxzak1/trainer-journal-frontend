import {inject, Injectable} from '@angular/core';
import {PracticeService} from './practice.service';
import {ICreateSinglePracticeRequestModel} from '../../request-models/schedule/ICreateSinglePractice.request-model';
import {Observable} from 'rxjs';
import {IPracticeModel} from '../../models/schedule/IPractice.model';
import {ICancelPracticeRequestModel} from '../../request-models/schedule/ICancelPractice.request-model';
import {IChangePracticeRequestModel} from '../../request-models/schedule/IChangePractice.request-model';

@Injectable({
    providedIn: 'root'
})
export class PracticeManagerService {
    private readonly _practiceService: PracticeService = inject(PracticeService);

    // Метод для создания одиночной практики
    createSinglePractice(request: ICreateSinglePracticeRequestModel): Observable<IPracticeModel> {
        return this._practiceService.createSinglePractice(request);
    }

    // Метод для получения практики по ID
    getPractice(id: string, practiceDate: Date): Observable<IPracticeModel> {
        return this._practiceService.getPractice(id, practiceDate);
    }

    // Метод для отмены практики
    cancelPractice(id: string, request: ICancelPracticeRequestModel): Observable<IPracticeModel> {
        return this._practiceService.cancelPractice(id, request);
    }

    // Метод для возобновления практики
    resumePractice(id: string): Observable<IPracticeModel> {
        return this._practiceService.resumePractice(id);
    }

    // Метод для изменения практики
    changePractice(id: string, request: IChangePracticeRequestModel): Observable<IPracticeModel> {
        return this._practiceService.changePractice(id, request);
    }
}
