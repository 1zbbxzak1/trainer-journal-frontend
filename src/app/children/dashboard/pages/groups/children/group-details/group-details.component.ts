import {ChangeDetectionStrategy, Component, HostListener, OnInit} from '@angular/core';
import {PopUpGroupService} from '../../../../../services/groups/pop-up-group.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params} from '@angular/router';
import {IStudentItemResponseModel} from '../../../../../../data/response-models/students/IStudentItem.response-model';
import {FormatterService} from '../../../../../services/formatter/formatter.service';
import {
    ICreateStudentResponseModel
} from '../../../../../../data/response-models/students/ICreateStudent.response-model';

@Component({
    selector: 'app-group-details',
    templateUrl: './group-details.component.html',
    styleUrls: ['./styles/group-details.component.css', '../../../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupDetailsComponent extends PopUpGroupService implements OnInit {
    protected groupsId: any[] = [];
    protected details: ICreateStudentResponseModel | null = null;
    protected search: string = '';
    protected columnsVisibility: Record<string, boolean> = {
        number: true,
        fullName: true,
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
        {key: 'gender', label: 'Пол'},
        {key: 'schoolGrade', label: 'Класс'},
        {key: 'birthDate', label: 'День рождения'},
        {key: 'age', label: 'Возраст'},
        {key: 'kyu', label: 'Кю'},
        {key: 'address', label: 'Адрес'},
        {key: 'contact', label: 'Контакт'}
    ];

    protected dropdownOpen: boolean = false;

    protected genderSortOrder: 'male' | 'female' | null = null;
    protected ageSortOrder: 'asc' | 'desc' | null = null;
    protected kyuSortOrder: 'asc' | 'desc' | null = null;

    constructor(
        private readonly _activatedRoute: ActivatedRoute,
        protected readonly _formatter: FormatterService,
    ) {
        super();
    }

    public ngOnInit(): void {
        this._activatedRoute.params.subscribe((params: Params): void => {
            this.selectedGroupId = params['id'];
            this.groupsId.push(this.selectedGroupId);

            this.getAllStudentsByGroup(this.selectedGroupId);
            this.getGroupById(this.selectedGroupId);
        });
    }

    protected toggleDropdownSettings(): void {
        this.dropdownOpen = !this.dropdownOpen;
        if (this.dropdownOpen) {
            this.selectedStudentUsername = null; // Закрыть другие активные дропдауны
        }
    }

    @HostListener('document:click', ['$event'])
    protected closeDropdown(event: MouseEvent): void {
        const clickedElement: HTMLElement = event.target as HTMLElement;
        const isDropdown: Element | null = clickedElement.closest('.dropdown-menu');
        const isButtonSettings: Element | null = clickedElement.closest('.settings');
        const isButtonMore: Element | null = clickedElement.closest('.second-button');

        if (!isDropdown && !isButtonMore) {
            this.selectedStudentUsername = null; // Закрываем dropdown, если кликнули вне меню или кнопки
        }

        if (!isDropdown && !isButtonSettings) {
            this.dropdownOpen = false;
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
        let filteredStudents: IStudentItemResponseModel[] = this.students?.filter((student: IStudentItemResponseModel) =>
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

                    this.getAllStudentsByGroup(this.selectedGroupId);

                    this.selectedStudentUsername = null;
                }
            });
        }
    }

    protected navigateToStudentProfile(username: string): void {
        this._router.navigate(['dashboard/groups/group-details/profile', username]);
    }
}
