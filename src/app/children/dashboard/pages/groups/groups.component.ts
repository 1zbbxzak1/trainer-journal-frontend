import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, HostListener} from '@angular/core';
import {Router} from '@angular/router';
import {GroupsManagerService} from '../../../../data/services/groups/groups.manager.service';
import {IGetGroupResponseModel} from '../../../../data/response-models/groups/IGetGroup.response-model';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ICreateGroupRequestModel} from '../../../../data/request-models/groups/ICreateGroup.request-model';
import {IGroupResponseModel} from '../../../../data/response-models/groups/IGroup.response-model';
import {IUpdateGroupInfoRequestModel} from '../../../../data/request-models/groups/IUpdateGroupInfoRequestModel';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./styles/groups.component.css', '../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent {
    protected groups: IGetGroupResponseModel | null = null;
    protected groupById: IGroupResponseModel | null = null;
    protected hexColor: string | null = null;
    protected selectedGroupId: string | null = null;
    protected isModalGroupVisible: boolean = false;
    protected isModalGroupEditVisible: boolean = false;
    protected isModalDeleteVisible: boolean = false;

    protected formGroups: FormGroup = new FormGroup({
        name: new FormControl('', Validators.required),
        price: new FormControl('', Validators.required),
        hallAddress: new FormControl('', Validators.required),
    });

    constructor(
        private readonly _router: Router,
        private readonly _destroyRef: DestroyRef,
        private readonly _cdr: ChangeDetectorRef,
        private readonly _groupsManagerService: GroupsManagerService,
    ) {
        this.getAllGroups();
    }

    protected openModalGroup(): void {
        this.formGroups.reset();
        this.isModalGroupVisible = true;
    }

    protected closeModalGroup(): void {
        this.isModalGroupVisible = false;
    }

    protected openModalGroupEdit(groupId: string): void {
        this.isModalGroupEditVisible = true;
        this.selectedGroupId = groupId;

        this.getGroupById(groupId);
    }

    protected closeModalGroupEdit(): void {
        this.isModalGroupEditVisible = false;
        this.formGroups.reset();
    }

    protected openModalDelete(groupId: string): void {
        this.isModalDeleteVisible = true;
        this.selectedGroupId = groupId;
    }

    protected closeModalDelete(): void {
        this.isModalDeleteVisible = false;
    }

    @HostListener('document:click', ['$event'])
    protected closeDropdown(event: MouseEvent): void {
        const clickedElement: HTMLElement = event.target as HTMLElement;
        const isDropdown: Element | null = clickedElement.closest('.dropdown-menu');
        const isButton: Element | null = clickedElement.closest('.second-button');

        if (!isDropdown && !isButton) {
            this.selectedGroupId = null; // Закрываем dropdown, если кликнули вне меню или кнопки
        }
    }

    protected toggleDropdown(groupId: string): void {
        if (this.selectedGroupId === groupId) {
            this.selectedGroupId = null; // Закрыть dropdown, если снова нажали на текущую кнопку
        } else {
            this.selectedGroupId = groupId; // Открыть dropdown для выбранной группы
        }
    }

    protected createGroup(): void {
        const name: string = this.formGroups.get('name')?.value;
        const price: number = this.formGroups.get('price')?.value;
        const hallAddress: string = this.formGroups.get('hallAddress')?.value;

        if (name && price && hallAddress) {
            const group: ICreateGroupRequestModel = {
                name,
                price,
                hallAddress,
                hexColor: this.hexColor,
            };

            this._groupsManagerService.createGroup(group).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.closeModalGroup();
                    this.getAllGroups();
                }
            });
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
                        this.closeModalGroupEdit();
                        this.getAllGroups();
                    }
                });
            }
        }
    }

    // Метод для удаления
    protected deleteGroupById(): void {
        if (this.selectedGroupId) {
            this._groupsManagerService.deleteGroupById(this.selectedGroupId).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.closeModalDelete();
                    this.getAllGroups();
                }
            });
        }
    }

    protected navigateToGroupDetails(groupId: string): void {
        this._router.navigate(['dashboard/groups/group-details/', groupId])
    }

    private getAllGroups(): void {
        this._groupsManagerService.getAllGroups().pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe({
            next: (groups: IGetGroupResponseModel): void => {
                this.groups = groups;
                this._cdr.detectChanges();
            },
        });
    }

    // Метод для получения данных о группе
    private getGroupById(groupId: string): void {
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
