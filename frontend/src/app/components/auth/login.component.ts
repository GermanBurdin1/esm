import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserService } from '../../services';
import { LoginRequest } from '../../simple-models';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="login-container">
      <div class="login-card-wrapper">
        <mat-card class="login-card">
          <mat-card-header class="login-header">
            <mat-card-title>
              <mat-icon class="login-icon">business</mat-icon>
              EMS - Enterprise Management System
            </mat-card-title>
            <mat-card-subtitle>Connectez-vous pour continuer</mat-card-subtitle>
          </mat-card-header>

          <mat-card-content>
            <form [formGroup]="loginForm" (ngSubmit)="onSubmit()" class="login-form">
              <mat-form-field class="full-width" appearance="outline">
                <mat-label>Nom d'utilisateur ou Email</mat-label>
                <input 
                  matInput 
                  formControlName="usernameOrEmail"
                  placeholder="admin ou admin@company.com"
                  autocomplete="username">
                <mat-icon matSuffix>person</mat-icon>
                <mat-error *ngIf="loginForm.get('usernameOrEmail')?.hasError('required')">
                  Le nom d'utilisateur ou email est requis
                </mat-error>
              </mat-form-field>

              <mat-form-field class="full-width" appearance="outline">
                <mat-label>Mot de passe</mat-label>
                <input 
                  matInput 
                  [type]="hidePassword ? 'password' : 'text'"
                  formControlName="password"
                  placeholder="password123"
                  autocomplete="current-password">
                <button 
                  mat-icon-button 
                  matSuffix 
                  type="button"
                  (click)="hidePassword = !hidePassword"
                  [attr.aria-label]="'Hide password'"
                  [attr.aria-pressed]="hidePassword">
                  <mat-icon>{{hidePassword ? 'visibility_off' : 'visibility'}}</mat-icon>
                </button>
                <mat-error *ngIf="loginForm.get('password')?.hasError('required')">
                  Le mot de passe est requis
                </mat-error>
              </mat-form-field>

              <button 
                mat-raised-button 
                color="primary" 
                type="submit" 
                class="login-button full-width"
                [disabled]="loginForm.invalid || loading">
                <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
                <span *ngIf="!loading">Se connecter</span>
              </button>
            </form>
          </mat-card-content>

          <mat-card-footer class="login-footer">
            <div class="demo-credentials">
              <h4>Comptes de démonstration :</h4>
              <div class="demo-accounts">
                <div class="demo-account" (click)="fillDemoAccount('admin')">
                  <strong>Admin:</strong> admin / password123
                </div>
                <div class="demo-account" (click)="fillDemoAccount('user')">
                  <strong>User:</strong> john_doe / password123
                </div>
              </div>
            </div>
          </mat-card-footer>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 20px;
    }

    .login-card-wrapper {
      width: 100%;
      max-width: 400px;
    }

    .login-card {
      padding: 20px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      border-radius: 16px;
    }

    .login-header {
      text-align: center;
      margin-bottom: 20px;
    }

    .login-icon {
      font-size: 3rem;
      width: 3rem;
      height: 3rem;
      display: block;
      margin: 0 auto 16px;
      color: #3f51b5;
    }

    .login-form {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .full-width {
      width: 100%;
    }

    .login-button {
      height: 48px;
      margin-top: 16px;
      font-size: 16px;
      font-weight: 500;
    }

    .login-footer {
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid #e0e0e0;
    }

    .demo-credentials h4 {
      margin: 0 0 12px 0;
      font-size: 14px;
      color: #666;
      text-align: center;
    }

    .demo-accounts {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .demo-account {
      padding: 8px 12px;
      background: #f5f5f5;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s;
      font-size: 12px;
    }

    .demo-account:hover {
      background: #eeeeee;
    }

    .demo-account strong {
      color: #3f51b5;
    }

    @media (max-width: 480px) {
      .login-container {
        padding: 16px;
      }
      
      .login-card {
        padding: 16px;
      }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.loginForm = this.fb.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Auto-fill admin credentials for demo
    this.fillDemoAccount('admin');
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.loading = true;
      const credentials: LoginRequest = this.loginForm.value;

      this.userService.validateCredentials(credentials).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.valid) {
            this.snackBar.open('Connexion réussie! Bienvenue', 'Fermer', { duration: 3000 });
            // Store user info in localStorage/sessionStorage
            sessionStorage.setItem('username', credentials.usernameOrEmail);
            this.router.navigate(['/dashboard']);
          } else {
            this.snackBar.open('Identifiants invalides', 'Fermer', { duration: 5000 });
          }
        },
        error: (error) => {
          this.loading = false;
          console.error('Login error:', error);
          this.snackBar.open('Erreur de connexion au serveur', 'Fermer', { duration: 5000 });
        }
      });
    }
  }

  fillDemoAccount(type: 'admin' | 'user'): void {
    if (type === 'admin') {
      this.loginForm.patchValue({
        usernameOrEmail: 'admin',
        password: 'password123'
      });
    } else {
      this.loginForm.patchValue({
        usernameOrEmail: 'john_doe',
        password: 'password123'
      });
    }
  }
}