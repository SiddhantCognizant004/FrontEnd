import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, FARMER_PATH } from '../elements/constants';
import { FarmerResponse, FarmerCreateRequest } from '../models/farmer.model';

@Injectable({ providedIn: 'root' })
export class FarmerService {
  private http = inject(HttpClient);
  private base = `${API_URL}${FARMER_PATH}`;

  createFarmer(farmer: FarmerCreateRequest): Observable<FarmerResponse> {
    return this.http.post<FarmerResponse>(`${this.base}`, farmer);
  }

  getFarmerById(id: number): Observable<FarmerResponse> {
    return this.http.get<FarmerResponse>(`${this.base}/${id}`);
  }

  getAllFarmers(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}`);
  }

  updateFarmer(id: number, farmer: Partial<FarmerCreateRequest>): Observable<any> {
    return this.http.put<any>(`${this.base}/${id}`, farmer);
  }

  deleteFarmer(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/${id}`);
  }
}
