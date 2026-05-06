import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'userRole', standalone: true })
export class UserRolePipe implements PipeTransform {
  private labels: Record<string, string> = {
    FARMER: 'Farmer', TRADER: 'Trader', OFFICER: 'Officer',
    MANAGER: 'Manager', ADMIN: 'Admin', COMPLIANCE: 'Compliance', AUDITOR: 'Auditor'
  };
  transform(value: string): string { return this.labels[value] ?? value; }
}

export function userRoleColor(role: string): string {
  const c: Record<string, string> = {
    FARMER: '#4CAF50', TRADER: '#2196F3', OFFICER: '#FF9800',
    MANAGER: '#9C27B0', ADMIN: '#F44336', COMPLIANCE: '#607D8B', AUDITOR: '#795548'
  };
  return c[role] ?? '#9E9E9E';
}
