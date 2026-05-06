import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, SUBSIDY_PATH } from '../elements/constants';
import { SubsidyProgram } from '../models/subsidy.model';

@Injectable({ providedIn: 'root' })
export class SubsidyProgramService {
  private http = inject(HttpClient);
  private base = `${API_URL}${SUBSIDY_PATH}`;

  getAll(): Observable<SubsidyProgram[]> {
    return this.http.get<SubsidyProgram[]>(`${this.base}`);
  }

  getById(id: number): Observable<SubsidyProgram> {
    return this.http.get<SubsidyProgram>(`${this.base}/${id}`);
  }

  create(program: Partial<SubsidyProgram>): Observable<SubsidyProgram> {
    return this.http.post<SubsidyProgram>(`${this.base}`, program);
  }

  update(id: number, program: SubsidyProgram): Observable<SubsidyProgram> {
    return this.http.put<SubsidyProgram>(`${this.base}/${id}`, program);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }

  searchByTitle(title: string): Observable<SubsidyProgram[]> {
    return this.http.get<SubsidyProgram[]>(`${this.base}/title/${title}`);
  }
}
