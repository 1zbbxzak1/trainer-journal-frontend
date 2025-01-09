import {ChangeDetectionStrategy, Component, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {FormArray, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {StudentsManagerService} from '../../../../../../data/services/students/students.manager.service';
import {ICreateStudentRequestModel} from '../../../../../../data/request-models/students/ICreateStudent.request-model';
import {GroupsManagerService} from '../../../../../../data/services/groups/groups.manager.service';
import {IGetGroupResponseModel} from '../../../../../../data/response-models/groups/IGetGroup.response-model';
import {IGroupItemModel} from '../../../../../../data/models/groups/IGroupItem.model';
import {ActivatedRoute} from '@angular/router';

@Component({
    selector: 'app-create-student-pop-up',
    standalone: false,

    templateUrl: './create-student-pop-up.component.html',
    styleUrl: './styles/create-student-pop-up.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateStudentPopUpComponent implements OnInit {
    @Input()
    public isVisible = false;
    @Input()
    public groupsId: any[] = [];
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();

    protected title: string = 'Регистрация ученика';
    protected desc: string = 'Поля, отмеченные звездочкой, обязательны для заполнения';
    protected showGroupSelector: boolean = false;
    protected isDropdownOpen: boolean = false;
    protected selectedGroup: any = null;
    protected groups: IGroupItemModel[] = [];

    protected readonly _studentsManagerService: StudentsManagerService = inject(StudentsManagerService);
    private readonly _groupsManagerService: GroupsManagerService = inject(GroupsManagerService);
    private _activatedRoute: ActivatedRoute = inject(ActivatedRoute);
    private _fb: FormBuilder = inject(FormBuilder);

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
        this.addContact();

        this._activatedRoute.url.subscribe(url => {
            if (url.join('/').includes('students')) {
                this.showGroupSelector = true; // Показываем поле для группы
            } else {
                this.showGroupSelector = false; // Показываем только адрес
            }

            this.loadGroups();
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

    protected toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    protected selectGroup(group: IGroupItemModel): void {
        this.selectedGroup = group;
        this.groupsId = [group.id];
        this.isDropdownOpen = false;
    }

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.createStudent();
        this.loadGroups();
        this.confirmAction.emit();
    }

    protected isControlError(controlName: string, formGroup?: FormGroup): boolean {
        const group = formGroup || this.formGroup; // Используем указанный formGroup или главный
        const control = group.get(controlName);
        return control ? control.invalid && (control.dirty || control.touched) : false;
    }

    protected createStudent(): void {
        if (this.formGroup.invalid) {
            this.formGroup.markAllAsTouched(); // Подсвечиваем все ошибки в форме
            return;
        }

        const formValue = this.formGroup.value;

        const student: ICreateStudentRequestModel = {
            fullName: formValue.fullName,
            gender: formValue.gender,
            birthDate: this.convertDateFormat(formValue.birthDate),
            schoolGrade: formValue.schoolGrade ? Number(formValue.schoolGrade) : 0,
            kyu: formValue.kyu ? Number(formValue.kyu) : null,
            address: formValue.address,
            groupIds: this.groupsId,
            contacts: formValue.contacts.map((contact: any) => ({
                name: contact.name,
                phone: contact.phone,
                relation: contact.relation,
            })),
        };


        this._studentsManagerService.createStudentInGroup(student).subscribe({
            next: (): void => {
                this.closeModal(); // Закрываем модалку
            }
        });
    }

    private convertDateFormat(dateString: string): string {
        const [day, month, year] = dateString.split('.').map(Number);

        const date: Date = new Date(year, month - 1, day);

        // Возвращаем строку в формате ISO
        return date.toISOString();
    }

    private loadGroups(): void {
        this._groupsManagerService.getAllGroups().subscribe({
            next: (response: IGetGroupResponseModel | null) => {
                if (response && response.groups) {
                    this.groups = response.groups;
                }
            }
        });
    }
}
