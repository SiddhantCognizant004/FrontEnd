import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'farmerGender', standalone: true })
export class FarmerGenderPipe implements PipeTransform {
  private labels: Record<string, string> = { MALE: 'Male', FEMALE: 'Female', OTHER: 'Other' };
  transform(value: string): string { return this.labels[value] ?? value; }
}
