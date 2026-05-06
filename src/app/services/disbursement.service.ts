import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, DISBURSEMENT_PATH } from '../elements/constants';
import { Disbursement, DisbursementDTO } from '../models/subsidy.model';

@Injectable({ providedIn: 'root' })
export class DisbursementService {
  private http = inject(HttpClient);
  private base = `${API_URL}${DISBURSEMENT_PATH}`;

  getAll(): Observable<Disbursement[]> {
    return this.http.get<Disbursement[]>(`${this.base}`);
  }

  getById(id: number): Observable<Disbursement> {
    return this.http.get<Disbursement>(`${this.base}/${id}`);
  }

  apply(dto: DisbursementDTO): Observable<Disbursement> {
    return this.http.post<Disbursement>(`${this.base}`, dto);
  }

  review(id: number, status: 'COMPLETED' | 'REJECTED'): Observable<any> {
    const params = new HttpParams().set('status', status);
    return this.http.patch(`${this.base}/${id}/review`, null, { params });
  }

  getByFarmer(farmerId: number): Observable<Disbursement[]> {
    return this.http.get<Disbursement[]>(`${this.base}/farmer/${farmerId}`);
  }

  getByProgram(programId: number): Observable<Disbursement[]> {
    return this.http.get<Disbursement[]>(`${this.base}/program/${programId}`);
  }
}
