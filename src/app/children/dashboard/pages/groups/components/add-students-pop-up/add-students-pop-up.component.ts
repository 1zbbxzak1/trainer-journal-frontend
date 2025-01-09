import {ChangeDetectorRef, Component, DestroyRef, EventEmitter, inject, Input, OnInit, Output} from '@angular/core';
import {StudentsManagerService} from '../../../../../../data/services/students/students.manager.service';
import {GroupsManagerService} from '../../../../../../data/services/groups/groups.manager.service';
import {IStudentItemResponseModel} from '../../../../../../data/response-models/students/IStudentItem.response-model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ActivatedRoute, Params} from '@angular/router';
import {IAddStudentRequestModel} from '../../../../../../data/request-models/students/IAddStudent.request-model';

@Component({
    selector: 'app-add-students-pop-up',
    templateUrl: './add-students-pop-up.component.html',
    styleUrl: './styles/add-students-pop-up.component.css'
})
export class AddStudentsPopUpComponent implements OnInit {
    @Input()
    public isVisible: boolean = false;
    @Output()
    protected close: EventEmitter<void> = new EventEmitter<void>();
    protected confirmAction: EventEmitter<void> = new EventEmitter<void>();
    protected isDropdownOpen: boolean = false;
    protected showStudentsWithoutGroup: boolean | null = false;
    protected selectedStudent!: string;
    protected students: IStudentItemResponseModel[] | null = [];
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly _studentManagerService: StudentsManagerService = inject(StudentsManagerService);
    private groupId: string = '';
    private readonly _groupsManagerService: GroupsManagerService = inject(GroupsManagerService);

    constructor(private readonly _activatedRoute: ActivatedRoute) {
    }

    public ngOnInit(): void {
        this.getAllStudents();

        this._activatedRoute.params.subscribe((params: Params): void => {
            this.groupId = params['id'];
        })
    }

    protected toggleDropdown(): void {
        this.isDropdownOpen = !this.isDropdownOpen;
    }

    protected closeModal(): void {
        this.close.emit();
    }

    protected confirm(): void {
        this.addStudent(this.groupId, this.selectedStudent);
        this.confirmAction.emit();
    }

    protected selectStudent(student: IStudentItemResponseModel): void {
        this.selectedStudent = student.username;
        this.isDropdownOpen = false;
    }

    protected getAllStudents(): void {
        const requestWithGroup: boolean = this.showStudentsWithoutGroup === null ? true : !this.showStudentsWithoutGroup;
        this._studentManagerService.getStudents(requestWithGroup).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: (students: IStudentItemResponseModel[] | null): void => {
                this.students = students;

                if (this.students) {
                    this.students.forEach((student: IStudentItemResponseModel): void => {
                        this._studentManagerService.getStudentGroups(student.username).pipe(
                            takeUntilDestroyed(this._destroyRef)
                        ).subscribe((): void => {
                            this._cdr.detectChanges();
                        });
                    });
                }

                this._cdr.detectChanges();
            }
        })
    }

    private addStudent(id: string, studentUsername: string): void {
        const student: IAddStudentRequestModel = {studentUsername};

        this._groupsManagerService.addStudentToGroup(id, student).pipe(
            takeUntilDestroyed(this._destroyRef),
        ).subscribe({
            next: (): void => {
                this.closeModal(); // Закрываем модалку
                this.selectedStudent = '';
            }
        });
    }
}
