export interface Invoice {
  clientId: string;
  id: string;
  clientName: string;
  price: {
    currency: string;
    value: number;
  };
  date?: string;
  status: Invoice_Status;
  submissionStatus: Submission_Status;
}

export enum Invoice_Status {
  PAID = "PAID",
  DISPUTED = "DISPUTED",
  OVERDUE = "OVERDUE",
  PARTIALLY_PAID = "PARTIALLY_PAID",
  AWAITED = "AWAITED",
  NONE = "NONE",
}

export enum Submission_Status {
  PUBLISHED = "PUBLISHED",
  DRAFT = "DRAFT",
}
