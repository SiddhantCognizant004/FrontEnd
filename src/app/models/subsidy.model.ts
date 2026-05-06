import { SubsidyStatus } from './enum.model';

export interface SubsidyProgram {
  programID: number;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  allottedBudget: number;
  consumedBudget: number;
  subsidyStatus: SubsidyStatus;
}

export interface Disbursement {
  disbursementID: number;
  farmerId: number;
  subsidyProgram: SubsidyProgram;
  disbursementAmount: number;
  disbursementDate: string;
  disbursementStatus: string;
}

export interface DisbursementDTO {
  farmerId: number;
  programId: number;
  disbursementAmount: number;
}
