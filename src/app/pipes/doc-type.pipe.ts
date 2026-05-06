import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'docType', standalone: true })
export class DocTypePipe implements PipeTransform {
  private labels: Record<string, string> = { ID_PROOF: 'ID Proof', LAND_RECORD: 'Land Record' };
  transform(value: string): string { return this.labels[value] ?? value; }
}

export function docTypeColor(type: string): string {
  return type === 'ID_PROOF' ? '#2196F3' : '#4CAF50';
}
