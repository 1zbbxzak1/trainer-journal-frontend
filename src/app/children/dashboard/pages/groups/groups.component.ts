import {ChangeDetectionStrategy, Component, HostListener} from '@angular/core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {ICreateGroupRequestModel} from '../../../../data/request-models/groups/ICreateGroup.request-model';
import {PopUpGroupService} from '../../../services/groups/pop-up-group.service';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./styles/groups.component.css', '../../styles/dashboard-styles.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GroupsComponent extends PopUpGroupService {
    constructor() {
        super();
        this.getAllGroups();
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
        this.selectedGroupId = this.selectedGroupId === groupId ? null : groupId;
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
                    this.toggleModal('group', false);
                    this.getAllGroups();
                }
            });
        }
    }

    // Метод для удаления
    protected deleteGroupById(): void {
        if (this.selectedGroupId) {
            this._groupsManagerService.deleteGroupById(this.selectedGroupId).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.selectedGroupId = null;
                    this.toggleModal('delete', false);
                    this.getAllGroups();
                }
            });
        }
    }

    protected navigateToGroupDetails(groupId: string): void {
        this._router.navigate(['dashboard/groups/group-details/', groupId])
    }
}
