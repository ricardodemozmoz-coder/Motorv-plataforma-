
import { InvestmentPlan } from './types';

export const INVESTMENT_PLANS: InvestmentPlan[] = [
  { 
    id: 1, 
    price: 300, 
    dailyReturn: 30, 
    duration: 30, 
    name: 'BMW Série 1', 
    image: 'https://images.unsplash.com/photo-1555215696-99ac90d72812?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 2, 
    price: 600, 
    dailyReturn: 60, 
    duration: 30, 
    name: 'Mercedes-Benz C-Class', 
    image: 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 3, 
    price: 1000, 
    dailyReturn: 100, 
    duration: 30, 
    name: 'Toyota Fortuner', 
    image: 'https://images.unsplash.com/photo-1629897048514-3dd74151e9a9?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 4, 
    price: 2500, 
    dailyReturn: 250, 
    duration: 30, 
    name: 'Mazda CX-5', 
    image: 'https://images.unsplash.com/photo-1517153295259-74eb0b416cee?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 5, 
    price: 5000, 
    dailyReturn: 500, 
    duration: 30, 
    name: 'Lamborghini Huracan', 
    image: 'https://images.unsplash.com/photo-1544605368-180a213000af?auto=format&fit=crop&w=800&q=80' 
  },
  { 
    id: 6, 
    price: 10000, 
    dailyReturn: 1000, 
    duration: 30, 
    name: 'Ferrari 488', 
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&w=800&q=80' 
  },
];

export const SUPPORT_TELEGRAM = "https://t.me/Diana563250";
export const MIN_WITHDRAWAL = 150;
export const MIN_DEPOSIT = 300;
export const WELCOME_BONUS = 100;
export const REFERRAL_PERCENTAGE = 0.20;

export const WITHDRAW_WINDOW = {
    startHour: 10,
    endHour: 19,
    days: [1, 2, 3, 4, 5] // 1=Mon, 5=Fri
};

export const PAYMENT_METHODS = {
  mpesa: {
    name: "M-Pesa",
    number: "856509305",
    owner: "Alfândega Ricardo"
  },
  emola: {
    name: "Emola",
    number: "866642416",
    owner: "Estevão Alexandrino"
  }
};
