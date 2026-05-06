import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_URL, AUDIT_LOG_PATH } from '../elements/constants';
import { AuditLogPage, AuditLogCreateRequest } from '../models/audit-log.model';

@Injectable({ providedIn: 'root' })
export class AuditLogService {
  private http = inject(HttpClient);
  private base = `${API_URL}${AUDIT_LOG_PATH}`;

  getLogs(page = 0, size = 10, sortBy = 'timestamp'): Observable<AuditLogPage> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sortBy', sortBy);
    return this.http.get<AuditLogPage>(`${this.base}/GetAllLogs`, { params });
  }

  createLog(dto: AuditLogCreateRequest): Observable<void> {
    return this.http.post<void>(`${this.base}/CreateLog`, dto);
  }
}
