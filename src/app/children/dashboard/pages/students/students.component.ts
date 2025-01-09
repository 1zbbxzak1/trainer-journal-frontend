import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {PopUpGroupService} from '../../../services/groups/pop-up-group.service';
import {FormatterService} from '../../../services/formatter/formatter.service';
import {IStudentItemResponseModel} from '../../../../data/response-models/students/IStudentItem.response-model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {StudentsManagerService} from '../../../../data/services/students/students.manager.service';
import {IGroupResponseModel} from '../../../../data/response-models/groups/IGroup.response-model';

@Component({
    selector: 'app-students',
    standalone: false,

    templateUrl: './students.component.html',
    styleUrls: ['./styles/students.component.css', '../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentsComponent extends PopUpGroupService implements OnInit {
    protected groupsId: any[] = [];
    protected allStudents: IStudentItemResponseModel[] | null = [];
    protected studentGroups: Record<string, IGroupResponseModel[]> = {};
    protected search: string = '';
    protected columnsVisibility: Record<string, boolean> = {
        number: true,
        fullName: true,
        group: true,
        gender: true,
        schoolGrade: true,
        birthDate: true,
        age: true,
        kyu: true,
        address: true,
        contact: true
    };

    protected columnNames = [
        {key: 'number', label: '№'},
        {key: 'fullName', label: 'ФИО'},
        {key: 'group', label: 'Группа'},
        {key: 'gender', label: 'Пол'},
        {key: 'schoolGrade', label: 'Класс'},
        {key: 'birthDate', label: 'День рождения'},
        {key: 'age', label: 'Возраст'},
        {key: 'kyu', label: 'Кю'},
        {key: 'address', label: 'Адрес'},
        {key: 'contact', label: 'Контакт'}
    ];

    protected dropdownOpen: boolean = false;
    protected showStudentsWithoutGroup: boolean | null = false;

    protected genderSortOrder: 'male' | 'female' | null = null;
    protected ageSortOrder: 'asc' | 'desc' | null = null;
    protected kyuSortOrder: 'asc' | 'desc' | null = null;

    constructor(
        private readonly _studentManagerService: StudentsManagerService,
        protected readonly _formatter: FormatterService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this.getStudents();
    }

    protected toggleDropdownSettings(): void {
        this.dropdownOpen = !this.dropdownOpen;
        if (this.dropdownOpen) {
            this.selectedStudentUsername = null; // Закрыть другие активные дропдауны
        }
    }

    protected toggleDropdown(studentUsername: string): void {
        this.selectedStudentUsername = this.selectedStudentUsername === studentUsername ? null : studentUsername;
        this.dropdownOpen = false;
    }

    protected toggleGenderSort(): void {
        if (this.genderSortOrder === null) {
            this.genderSortOrder = 'male';
        } else if (this.genderSortOrder === 'male') {
            this.genderSortOrder = 'female';
        } else {
            this.genderSortOrder = null;
        }
    }

    protected toggleAgeSort(): void {
        if (this.ageSortOrder === null) {
            this.ageSortOrder = 'asc';
        } else if (this.ageSortOrder === 'asc') {
            this.ageSortOrder = 'desc';
        } else {
            this.ageSortOrder = null;
        }
    }

    protected toggleKyuSort(): void {
        if (this.kyuSortOrder === null) {
            this.kyuSortOrder = 'asc';
        } else if (this.kyuSortOrder === 'asc') {
            this.kyuSortOrder = 'desc';
        } else {
            this.kyuSortOrder = null;
        }
    }

    protected searchStudents(): IStudentItemResponseModel[] {
        let filteredStudents: IStudentItemResponseModel[] = this.allStudents?.filter((student: IStudentItemResponseModel) =>
            student.fullName.toLowerCase().includes(this.search.toLowerCase())
        ) || [];

        // Функция сравнения для сортировки
        const compare = (a: IStudentItemResponseModel, b: IStudentItemResponseModel): number => {
            // Сортировка по полу
            if (this.genderSortOrder) {
                const genderPriority: string = this.genderSortOrder === 'male' ? 'М' : 'Ж';
                const genderComparison: 1 | -1 | 0 = a.gender === genderPriority ? -1 : b.gender === genderPriority ? 1 : 0;

                if (genderComparison !== 0)
                    return genderComparison;
            }

            // Сортировка по возрасту
            if (this.ageSortOrder) {
                const ageComparison: number = this.ageSortOrder === 'asc' ? a.age - b.age : b.age - a.age;

                if (ageComparison !== 0)
                    return ageComparison;
            }

            // Сортировка по кю
            if (this.kyuSortOrder) {
                const kyuComparison: number = this.kyuSortOrder === 'asc'
                    ? (a.kyu || Infinity) - (b.kyu || Infinity)
                    : (b.kyu || -Infinity) - (a.kyu || -Infinity);

                if (kyuComparison !== 0)
                    return kyuComparison;
            }

            return 0; // Если все критерии равны
        };

        // Применяем сортировку
        filteredStudents = filteredStudents.sort(compare);

        return filteredStudents;
    }

    protected getGenderSortIcon(): string {
        if (this.genderSortOrder === 'male') {
            return 'assets/chevron-down.svg';
        } else if (this.genderSortOrder === 'female') {
            return 'assets/chevron-up.svg';
        }
        return 'assets/chevron-selector-vertical.svg';
    }

    protected getAgeSortIcon(): string {
        if (this.ageSortOrder === 'asc') {
            return 'assets/chevron-down.svg';
        } else if (this.ageSortOrder === 'desc') {
            return 'assets/chevron-up.svg';
        }
        return 'assets/chevron-selector-vertical.svg';
    }

    protected getKyuSortIcon(): string {
        if (this.kyuSortOrder === 'asc') {
            return 'assets/chevron-down.svg';
        } else if (this.kyuSortOrder === 'desc') {
            return 'assets/chevron-up.svg';
        }
        return 'assets/chevron-selector-vertical.svg';
    }

    protected formatBirthDate(birthDate: Date | string): string {
        return this._formatter.formatBirthDate(birthDate);
    }

    protected formatPhoneNumber(phone: string): string {
        return this._formatter.formatPhoneNumber(phone);
    }

    protected excludeStudentFromGroup(): void {
        if (this.selectedGroupId && this.selectedStudentUsername) {
            this._groupsManagerService.excludeStudentFromGroup(this.selectedGroupId, this.selectedStudentUsername).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.toggleModal('delete', false);

                    this.getStudents();

                    this.selectedStudentUsername = null;
                }
            });
        }
    }

    protected getStudents(): void {
        const requestWithGroup: boolean = this.showStudentsWithoutGroup === null ? true : !this.showStudentsWithoutGroup;
        this._studentManagerService.getStudents(requestWithGroup).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: (students: IStudentItemResponseModel[] | null): void => {
                this.allStudents = students;

                if (this.allStudents) {
                    this.allStudents.forEach((student: IStudentItemResponseModel): void => {
                        this._studentManagerService.getStudentGroups(student.username).pipe(
                            takeUntilDestroyed(this._destroyRef)
                        ).subscribe((groups: IGroupResponseModel[]): void => {
                            this.studentGroups[student.username] = groups.length > 0 ? groups : [];

                            this._cdr.detectChanges();
                        });
                    });
                }

                this._cdr.detectChanges();
            }
        })
    }

    protected navigateToStudentProfile(username: string): void {
        this._router.navigate(['dashboard/students/profile', username]);
    }
}
