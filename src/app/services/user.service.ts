import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, USER_PATH } from '../elements/constants';
import { UserResponse, UserRegisterRequest, UserUpdateRequest } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserService {
  private http = inject(HttpClient);
  private base = `${API_URL}${USER_PATH}`;

  getAllUsers(): Observable<UserResponse[]> {
    return this.http.get<UserResponse[]>(`${this.base}`);
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.http.get<UserResponse>(`${this.base}/${id}`);
  }

  updateUser(id: number, dto: UserUpdateRequest): Observable<UserResponse> {
    return this.http.put<UserResponse>(`${this.base}/${id}`, dto);
  }

  deactivateUser(id: number): Observable<string> {
    return this.http.delete<string>(`${this.base}/${id}`);
  }
}
