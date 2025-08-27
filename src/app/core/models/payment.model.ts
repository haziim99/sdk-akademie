export interface Payment {
  id: string;
  amount: number;
  method: string;
  date: Date;
  status: string;
}
