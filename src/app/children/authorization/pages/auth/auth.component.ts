import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {Validator} from '../../../../validators/validator';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IAuthRequestModel} from '../../../../data/request-models/auth/IAuth.request-model';
import {AuthManagerService} from '../../../../data/services/auth/auth.manager.service';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrl: './styles/auth.component.css',
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthComponent implements OnInit {
    protected form: FormGroup = new FormGroup({
        userName: new FormControl('', [Validators.required]),
        password: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(15)]),
    });
    protected passwordVisible: boolean = false;
    protected isHovered: boolean = false;
    protected isFocused: boolean = false;

    protected loginError: string | null = null;

    private readonly _router: Router = inject(Router);
    private readonly _destroyRef: DestroyRef = inject(DestroyRef);
    private readonly _cdr: ChangeDetectorRef = inject(ChangeDetectorRef);

    private readonly _authManagerService: AuthManagerService = inject(AuthManagerService);
    private readonly _controlValidator: Validator = new Validator(this.form);

    protected get eyeIcon(): string {
        if (this.passwordVisible) {
            if (this.isHovered || this.isFocused) {
                return '/assets/eye-focused.svg';
            } else {
                return '/assets/eye-default.svg';
            }
        } else {
            if (this.isHovered || this.isFocused) {
                return '/assets/eye-off-focused.svg';
            } else {
                return '/assets/eye-off-default.svg';
            }
        }
    }

    ngOnInit(): void {
        this.form.valueChanges.pipe(
            takeUntilDestroyed(this._destroyRef)
        ).subscribe((): void => {
            this.loginError = null;
        });
    }

    protected loginUser(): void {
        const userName: string = this.form.get('userName')?.value;
        const password: string = this.form.get('password')?.value;

        if (userName && password) {
            const user: IAuthRequestModel = {userName, password};

            this._authManagerService.loginUser(user).pipe(
                takeUntilDestroyed(this._destroyRef)
            ).subscribe({
                next: (): void => {
                    this.loginError = null;
                    this._router.navigate(["dashboard/groups"]);
                },
                error: (error): void => {
                    this.loginError = error.message;
                    this._cdr.markForCheck();
                }
            });
        }
    }

    protected isControlError(controlName: string): boolean {
        return this._controlValidator.isControlError(controlName);
    }

    protected togglePasswordVisibility(): void {
        this.passwordVisible = !this.passwordVisible;
    }

    protected onHover(isHovered: boolean): void {
        this.isHovered = isHovered;
    }

    protected onFocus(isFocused: boolean): void {
        this.isFocused = isFocused;
    }
}
