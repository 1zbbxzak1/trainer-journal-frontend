import {ChangeDetectorRef, DestroyRef, inject, Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {IGroupResponseModel} from '../../../data/response-models/groups/IGroup.response-model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {GroupsManagerService} from '../../../data/services/groups/groups.manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IUpdateGroupInfoRequestModel} from '../../../data/request-models/groups/IUpdateGroupInfoRequestModel';
import {IGetGroupResponseModel} from '../../../data/response-models/groups/IGetGroup.response-model';
import {IStudentItemResponseModel} from '../../../data/response-models/students/IStudentItem.response-model';

@Injectable()
export class PopUpGroupService {
    protected groups: IGetGroupResponseModel | null = null;
    protected groupById: IGroupResponseModel | null = null;
    protected students: IStudentItemResponseModel[] | null = null;
    protected hexColor: string | null = null;
    protected selectedGroupId: string | null = null;
    protected selectedStudentUsername: string | null = null;

    protected modalStates = {
        group: false,
        groupEdit: false,
        delete: false,
        add: false,
        create: false,
        loginDetails: false
    };

    protected formGroups: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
        hallAddress: new FormControl('', Validators.required),
    });

    protected readonly _router: Router = inject(Router);
    protected readonly _destroyRef: DestroyRef = inject(DestroyRef);
    protected readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);
    protected readonly _groupsManagerService: GroupsManagerService = inject(GroupsManagerService);

    protected toggleModal(type: keyof typeof this.modalStates, state: boolean, groupId?: string | null, username?: string): void {
        this.modalStates[type] = state;

        if (state) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        if (type === 'groupEdit' && state && groupId) {
            this.selectedGroupId = groupId;
            this.getGroupById(groupId);
        } else if (type === 'delete' && state && groupId && username) {
            this.selectedGroupId = groupId;
            this.selectedStudentUsername = username;
        } else if (!state) {
            this.formGroups.reset();
        }
    }


    // Метод для редактирования
    protected updateGroupById(): void {
        if (this.selectedGroupId) {
            const name: string = this.formGroups.get('name')?.value;
            const price: number = this.formGroups.get('price')?.value;
            const hallAddress: string = this.formGroups.get('hallAddress')?.value;

            if (name && price && hallAddress) {
                const groupById: IUpdateGroupInfoRequestModel = {
                    name,
                    price,
                    hallAddress,
                    hexColor: this.hexColor,
                };

                this._groupsManagerService.updateGroupById(this.selectedGroupId, groupById).pipe(
                    takeUntilDestroyed(this._destroyRef)
                ).subscribe({
                    next: (): void => {
                        this.getGroupById(this.selectedGroupId);
                        this.toggleModal('groupEdit', false);
                        this.getAllGroups();
                    }
                });
            }
        }
    }

    protected getAllGroups(): void {
        this._groupsManagerService.getAllGroups().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (groups: IGetGroupResponseModel | null): void => {
                this.groups = groups;

                this._cdr.detectChanges();
            },
        });
    }

    protected getAllStudentsByGroup(groupId: string | null): void {
        this._groupsManagerService.getAllStudentsByGroup(groupId).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (students: IStudentItemResponseModel[] | null): void => {
                this.students = students;

                this._cdr.detectChanges();
            }
        });
    }

    protected getGroupById(groupId: string | null): void {
        this._groupsManagerService.getGroupById(groupId).pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((groupById: IGroupResponseModel): void => {
            this.groupById = groupById;

            if (groupById) {
                this.formGroups.patchValue({
                    name: groupById.name,
                    price: groupById.price,
                    hallAddress: groupById.hallAddress,
                })
                this.hexColor = groupById.hexColor;

                this._cdr.detectChanges();
            }
        });
    }
}
