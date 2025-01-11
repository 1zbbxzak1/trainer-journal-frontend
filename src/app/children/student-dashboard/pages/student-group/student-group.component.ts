import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, OnInit} from '@angular/core';
import {IStudentItemResponseModel} from '../../../../data/response-models/students/IStudentItem.response-model';
import {IGroupResponseModel} from '../../../../data/response-models/groups/IGroup.response-model';
import {GroupsManagerService} from '../../../../data/services/groups/groups.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ProfileManagerService} from '../../../../data/services/profile/profile.manager.service';
import {IFullInfoModel} from '../../../../data/models/profile/IFullInfo.model';
import {concatMap, map} from 'rxjs';
import {StudentsManagerService} from '../../../../data/services/students/students.manager.service';

@Component({
    selector: 'app-student-group',
    standalone: false,

    templateUrl: './student-group.component.html',
    styleUrls: ['./styles/student-group.component.css', '../../styles/student-dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class StudentGroupComponent implements OnInit {
    protected isLoading: boolean = true;
    protected students: IStudentItemResponseModel[] | null = null;
    protected groupById: IGroupResponseModel | null = null;

    protected search: string = '';
    protected kyuSortOrder: 'asc' | 'desc' | null = null;

    private _username: string = '';
    private _groupId: string | null = null;

    constructor(
        protected readonly _destroyRef: DestroyRef,
        protected readonly _cdr: ChangeDetectorRef,
        protected readonly _groupsManagerService: GroupsManagerService,
        protected readonly _profileManagerService: ProfileManagerService,
        protected readonly _studentsManagerService: StudentsManagerService,
    ) {
    }

    public ngOnInit(): void {
        this.getUsername();
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

    protected getKyuSortIcon(): string {
        if (this.kyuSortOrder === 'asc') {
            return 'assets/chevron-down.svg';
        } else if (this.kyuSortOrder === 'desc') {
            return 'assets/chevron-up.svg';
        }
        return 'assets/chevron-selector-vertical.svg';
    }

    protected searchStudents(): IStudentItemResponseModel[] {
        let filteredStudents: IStudentItemResponseModel[] = this.students?.filter((student: IStudentItemResponseModel) =>
            student.fullName.toLowerCase().includes(this.search.toLowerCase())
        ) || [];

        // Функция сравнения для сортировки
        const compare = (a: IStudentItemResponseModel, b: IStudentItemResponseModel): number => {
            if (this.kyuSortOrder) {
                const kyuComparison: number = this.kyuSortOrder === 'asc'
                    ? (a.kyu || Infinity) - (b.kyu || Infinity)
                    : (b.kyu || -Infinity) - (a.kyu || -Infinity);

                if (kyuComparison !== 0)
                    return kyuComparison;
            }

            return 0;
        };

        filteredStudents = filteredStudents.sort(compare);

        return filteredStudents;
    }

    private getUsername(): void {
        this._profileManagerService.getInfoMe().pipe(
            takeUntilDestroyed(this._destroyRef),
            map((me: IFullInfoModel) => {
                this._username = me.username;
                this._cdr.detectChanges();

                return me;
            }),
            concatMap(() => {
                return this.getStudentGroupId(this._username);
            }),
            concatMap(() => {
                return this.getGroupById(this._groupId);
            }),
            concatMap(() => {
                return this.getAllStudentsByGroup(this._groupId);
            })
        ).subscribe();
    }

    private getStudentGroupId(username: string) {
        return this._studentsManagerService.getStudentGroups(username).pipe(
            takeUntilDestroyed(this._destroyRef),
            map((students: IGroupResponseModel[]) => {
                this._groupId = students[0].id;

                this.timeout(1500);

                return students;
            })
        )
    }

    private getGroupById(groupId: string | null) {
        return this._groupsManagerService.getGroupById(groupId).pipe(
            takeUntilDestroyed(this._destroyRef),
            map((groupById: IGroupResponseModel) => {
                this.groupById = groupById;

                this.timeout(1500);

                return groupById;
            })
        );
    }

    private getAllStudentsByGroup(groupId: string | null) {
        return this._groupsManagerService.getAllStudentsByGroup(groupId).pipe(
            takeUntilDestroyed(this._destroyRef),
            map((students: IStudentItemResponseModel[] | null) => {
                this.students = students;

                this.timeout(1500);

                return students;
            })
        );
    }

    private timeout(time: number): void {
        setTimeout((): void => {
            this.isLoading = false;
            this._cdr.detectChanges();
        }, time);
    }
}
