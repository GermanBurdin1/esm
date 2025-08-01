import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { 
  User, 
  LoginRequest, 
  LoginResponse 
} from '../simple-models';

export interface CreateUserRequest {
  username: string;
  email: string;
  passwordHash: string;
  role: 'USER' | 'ADMIN';
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly endpoint = '/users';

  constructor(private apiService: ApiService) {}

  // Obtenir tous les utilisateurs
  getAllUsers(): Observable<User[]> {
    return this.apiService.get<User[]>(this.endpoint);
  }

  // Obtenir l'utilisateur par ID
  getUserById(id: number): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/${id}`);
  }

  // Obtenir l'utilisateur par nom
  getUserByUsername(username: string): Observable<User> {
    return this.apiService.get<User>(`${this.endpoint}/username/${username}`);
  }

  // Créer un nouvel utilisateur
  createUser(user: CreateUserRequest): Observable<User> {
    return this.apiService.post<User>(this.endpoint, user);
  }

  // Mettre à jour l'utilisateur
  updateUser(id: number, user: Partial<User>): Observable<User> {
    return this.apiService.put<User>(`${this.endpoint}/${id}`, user);
  }

  // Supprimer l'utilisateur
  deleteUser(id: number): Observable<void> {
    return this.apiService.delete<void>(`${this.endpoint}/${id}`);
  }

  // Vérifier les identifiants de l'utilisateur (Login)
  validateCredentials(credentials: LoginRequest): Observable<LoginResponse> {
    return this.apiService.post<LoginResponse>(`${this.endpoint}/validate`, credentials);
  }
}