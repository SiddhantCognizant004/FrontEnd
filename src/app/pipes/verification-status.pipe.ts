import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'verificationStatus', standalone: true })
export class VerificationStatusPipe implements PipeTransform {
  private labels: Record<string, string> = {
    PENDING: 'Pending Review', VERIFIED: 'Verified', REJECTED: 'Rejected'
  };
  transform(value: string): string { return this.labels[value] ?? value; }
}

export function verificationStatusColor(status: string): string {
  const c: Record<string, string> = { PENDING: '#FFC107', VERIFIED: '#4CAF50', REJECTED: '#F44336' };
  return c[status] ?? '#9E9E9E';
}
