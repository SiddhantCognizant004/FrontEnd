import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, DOCUMENT_PATH } from '../elements/constants';
import { FarmerDocument } from '../models/document.model';

@Injectable({ providedIn: 'root' })
export class DocumentService {
  private http = inject(HttpClient);
  private base = `${API_URL}${DOCUMENT_PATH}`;

  uploadDocument(farmerId: number, file: File, docType: string): Observable<FarmerDocument> {
    const fd = new FormData();
    fd.append('file', file);
    return this.http.post<FarmerDocument>(
      `${this.base}/farmer/${farmerId}/upload?docType=${docType}`, fd
    );
  }

  getDocumentsByFarmer(farmerId: number): Observable<FarmerDocument[]> {
    return this.http.get<FarmerDocument[]>(`${this.base}/farmer/${farmerId}`);
  }

  getAllDocuments(): Observable<FarmerDocument[]> {
    return this.http.get<FarmerDocument[]>(`${this.base}/all`);
  }

  verifyDocument(documentId: number, status: string): Observable<FarmerDocument> {
    return this.http.patch<FarmerDocument>(
      `${this.base}/${documentId}/verify?status=${status}`, {}
    );
  }
}
