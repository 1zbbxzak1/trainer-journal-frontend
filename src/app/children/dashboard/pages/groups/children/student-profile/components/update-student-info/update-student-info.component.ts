import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ProfileManagerService} from '../../../../../../../../data/services/profile/profile.manager.service';
import {
    IUpdateUserStudentInfoRequestModel
} from '../../../../../../../../data/request-models/profile/IUpdateUserStudentInfo.request-model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IFullInfoModel} from '../../../../../../../../data/models/profile/IFullInfo.model';
import {FormatterService} from '../../../../../../../services/formatter/formatter.service';

@Component({
    selector: 'app-update-student-info',
    templateUrl: './update-student-info.component.html',
    styleUrl: './styles/update-student-info.component.css'
})
export class UpdateStudentInfoComponent implements OnInit {
    @Input()
    public isVisible = false;
    @Input()
    public username: string = '';
    @Input()
    public infoUser!: IFullInfoModel | null;
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();

    protected title: string = 'Редактирование ученика';
    protected desc: string = 'Поля, отмеченные звездочкой, обязательны для заполнения';

    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _profileManagerService: ProfileManagerService = inject(ProfileManagerService);
    private readonly _formatter: FormatterService = inject(FormatterService);
    private _fb: FormBuilder = inject(FormBuilder);

    @Input()
    protected formGroup: FormGroup = this._fb.group({
        fullName: ['', Validators.required],
        gender: ['', Validators.required],
        birthDate: ['', Validators.required],
        schoolGrade: [''],
        kyu: [''],
        address: ['', Validators.required],
        contacts: this._fb.array([]),
    });

    // Геттер для работы с массивом контактов
    protected get contacts(): FormArray {
        return this.formGroup.get('contacts') as FormArray;
    }

    public ngOnInit(): void {
        // Очищаем массив контактов перед добавлением
        this.contacts.clear();

        // Если первый контакт существует, добавляем его
        if (this.infoUser!.studentInfo!.contacts[0]) {
            this.addContact();
            this.contacts.at(0).patchValue(this.infoUser!.studentInfo!.contacts[0]);
        }

        // Если второй контакт существует, добавляем его
        if (this.infoUser!.studentInfo!.contacts[1]) {
            this.addContact();
            this.contacts.at(1).patchValue(this.infoUser!.studentInfo!.contacts[1]);
        }

        // Заполняем остальные поля формы
        this.formGroup.patchValue({
            fullName: this.infoUser!.userInfo!.fullName,
            gender: this.infoUser!.userInfo!.gender,
            birthDate: this._formatter.formatBirthDate(this.infoUser!.studentInfo!.birthDate),
            schoolGrade: this.infoUser!.studentInfo!.schoolGrade,
            kyu: this.infoUser!.studentInfo!.kyu,
            address: this.infoUser!.studentInfo!.address,
        });
    }

    // Метод для добавления нового контакта
    protected addContact(): void {
        if (this.contacts.length < 2) {
            const contactGroup = this._fb.group({
                name: ['', Validators.required],
                phone: ['', [Validators.required, Validators.pattern(/^\+7\d{10}$/)]],
                relation: ['', Validators.required],
            });
            this.contacts.push(contactGroup);
        }
    }

    // Метод для удаления контакта
    protected removeContact(index: number): void {
        // Удаление возможно только для второго контакта
        if (index > 0) {
            this.contacts.removeAt(index);
        }
    }

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.updateInfoUser(this.username);
        this.confirmAction.emit();
        this.closeModal();
    }

    protected isControlError(controlName: string, formGroup?: FormGroup): boolean {
        const group = formGroup || this.formGroup; // Используем указанный formGroup или главный
        const control = group.get(controlName);
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    protected updateInfoUser(username: string): void {
        const infoUser: IUpdateUserStudentInfoRequestModel = {
            userInfo: {
                fullName: this.formGroup.value.fullName,
                gender: this.formGroup.value.gender,
                telegramUsername: null,
            },
            studentInfo: {
                schoolGrade: this.formGroup.value.schoolGrade,
                address: this.formGroup.value.address,
                kyu: this.formGroup.value.kyu,
                birthDate: this.convertDateFormat(this.formGroup.value.birthDate),
                contacts: this.formGroup.value.contacts,
            }
        };

        this._profileManagerService.updateInfoUser(username, infoUser).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (): void => {
                this._cdr.detectChanges();
            }
        });
    }

    private convertDateFormat(dateString: string): string {
        // Разделение строки на компоненты: день, месяц, год
        const [day, month, year] = dateString.split('.').map(Number);

        // Создание объекта Date, учтите, что месяц в JavaScript начинается с 0
        const date: Date = new Date(year, month - 1, day);

        // Возвращаем строку в формате ISO
        return date.toISOString();
    }
}
