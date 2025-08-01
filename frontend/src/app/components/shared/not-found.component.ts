import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="not-found-container">
      <div class="not-found-content">
        <div class="error-icon">
          <mat-icon>sentiment_dissatisfied</mat-icon>
        </div>
        
        <h1>404</h1>
        <h2>Page non trouvée</h2>
        <p>
          Désolé, la page que vous recherchez n'existe pas ou a été déplacée.
        </p>
        
        <div class="actions">
          <button mat-raised-button color="primary" routerLink="/dashboard">
            <mat-icon>dashboard</mat-icon>
            Retour au tableau de bord
          </button>
          <button mat-button routerLink="/workspaces">
            <mat-icon>work</mat-icon>
            Espaces de travail
          </button>
        </div>
        
        <div class="helpful-links">
          <h3>Liens utiles :</h3>
          <ul>
            <li><a routerLink="/dashboard">Tableau de bord</a></li>
            <li><a routerLink="/workspaces">Espaces de travail</a></li>
            <li><a routerLink="/boards">Tableaux</a></li>
            <li><a routerLink="/tasks">Tâches</a></li>
            <li><a routerLink="/users">Utilisateurs</a></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .not-found-container {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    }

    .not-found-content {
      text-align: center;
      background: white;
      padding: 60px 40px;
      border-radius: 16px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.2);
      max-width: 500px;
      width: 100%;
    }

    .error-icon {
      margin-bottom: 24px;
    }

    .error-icon mat-icon {
      font-size: 4rem;
      width: 4rem;
      height: 4rem;
      color: #666;
    }

    h1 {
      font-size: 5rem;
      font-weight: 700;
      margin: 0;
      color: #3f51b5;
      line-height: 1;
    }

    h2 {
      font-size: 1.8rem;
      font-weight: 400;
      margin: 16px 0;
      color: #333;
    }

    p {
      color: #666;
      font-size: 1.1rem;
      line-height: 1.5;
      margin: 0 0 32px 0;
    }

    .actions {
      display: flex;
      gap: 16px;
      justify-content: center;
      margin-bottom: 40px;
      flex-wrap: wrap;
    }

    .actions button {
      display: flex;
      align-items: center;
      gap: 8px;
    }

    .helpful-links {
      border-top: 1px solid #e0e0e0;
      padding-top: 24px;
      text-align: left;
    }

    .helpful-links h3 {
      margin: 0 0 16px 0;
      font-size: 1.1rem;
      color: #333;
    }

    .helpful-links ul {
      list-style: none;
      padding: 0;
      margin: 0;
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
      gap: 8px;
    }

    .helpful-links li {
      margin: 0;
    }

    .helpful-links a {
      color: #3f51b5;
      text-decoration: none;
      font-size: 0.9rem;
      transition: color 0.2s ease;
    }

    .helpful-links a:hover {
      color: #303f9f;
      text-decoration: underline;
    }

    @media (max-width: 480px) {
      .not-found-container {
        padding: 16px;
      }
      
      .not-found-content {
        padding: 40px 24px;
      }

      h1 {
        font-size: 3.5rem;
      }

      h2 {
        font-size: 1.5rem;
      }

      .actions {
        flex-direction: column;
      }

      .actions button {
        width: 100%;
        justify-content: center;
      }

      .helpful-links ul {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class NotFoundComponent {}