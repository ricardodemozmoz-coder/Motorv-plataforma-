
export interface InvestmentPlan {
  id: number;
  price: number;
  dailyReturn: number;
  duration: number; // days
  name: string;
  image: string;
}

export interface User {
  phone: string;
  balance: number; // Current withdrawable balance
  bonus: number; // Non-withdrawable bonus
  hasInvested: boolean;
  activePlans: ActivePlan[];
  referralEarnings: number;
}

export interface ActivePlan {
  id: string;
  planId: number;
  startDate: string;
  daysRemaining: number;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'withdrawal' | 'earning' | 'bonus' | 'referral';
  amount: number;
  status: 'pending' | 'completed' | 'rejected';
  date: string;
  method?: string; // M-Pesa or Emola
}

export type ViewState = 'landing' | 'auth' | 'dashboard' | 'deposit' | 'withdraw' | 'plans' | 'referral' | 'transactions';
