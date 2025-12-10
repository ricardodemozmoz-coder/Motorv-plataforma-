
import React, { useState, useEffect } from 'react';
import { ViewState, User, Transaction, ActivePlan } from './types';
import { INVESTMENT_PLANS, WELCOME_BONUS, MIN_WITHDRAWAL, MIN_DEPOSIT, WITHDRAW_WINDOW } from './constants';
import LandingPage from './components/LandingPage';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import Navigation from './components/Navigation';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('landing');
  const [user, setUser] = useState<User | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  
  // State to control if Auth should start in Register mode
  const [isAuthRegister, setIsAuthRegister] = useState(false);

  // Simulation of a notification system
  const [notification, setNotification] = useState<{message: string, type: 'success' | 'error'} | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
  };

  const handleStart = () => {
      setIsAuthRegister(true);
      setCurrentView('auth');
  }

  const handleLogin = (phone: string) => {
    // Mock login/register - in a real app this would hit an API
    // We simulate a fresh user with the welcome bonus
    const mockUser: User = {
      phone,
      balance: 0,
      bonus: WELCOME_BONUS,
      hasInvested: false,
      activePlans: [],
      referralEarnings: 0
    };
    setUser(mockUser);
    
    // Add initial bonus transaction record
    const bonusTx: Transaction = {
      id: `tx-${Date.now()}`,
      type: 'bonus',
      amount: WELCOME_BONUS,
      status: 'completed',
      date: new Date().toISOString()
    };
    setTransactions([bonusTx]);
    
    setCurrentView('dashboard');
    showNotification("Bem-vindo! Recebeste 100 MT de bónus.", 'success');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('landing');
    setIsAuthRegister(false);
  };

  const handleDeposit = (amount: number, method: string, transactionId?: string) => {
    if (amount < MIN_DEPOSIT) {
        showNotification(`O depósito mínimo é de ${MIN_DEPOSIT} MT.`, 'error');
        return;
    }

    // Deposits are manually approved, so always pending
    const status = 'pending';

    const newTx: Transaction = {
      id: transactionId || `dep-${Date.now()}`,
      type: 'deposit',
      amount,
      status: status,
      date: new Date().toISOString(),
      method
    };

    setTransactions(prev => [newTx, ...prev]);

    showNotification("Depósito enviado para aprovação manual.", 'success');
    
    setCurrentView('dashboard');
  };

  const handleWithdraw = (amount: number, method: string) => {
    if (!user) return;

    // Check Business Days and Hours
    const now = new Date();
    const day = now.getDay(); // 0 is Sunday, 6 is Saturday
    const hour = now.getHours();

    const isBusinessDay = WITHDRAW_WINDOW.days.includes(day);
    const isBusinessHour = hour >= WITHDRAW_WINDOW.startHour && hour < WITHDRAW_WINDOW.endHour;

    if (!isBusinessDay || !isBusinessHour) {
        showNotification(`Levantamentos apenas de Seg a Sex, das ${WITHDRAW_WINDOW.startHour}h às ${WITHDRAW_WINDOW.endHour}h.`, 'error');
        return;
    }

    if (amount < MIN_WITHDRAWAL) {
      showNotification(`Mínimo para levantamento é ${MIN_WITHDRAWAL} MT`, 'error');
      return;
    }

    if (!user.hasInvested) {
      showNotification("Deves fazer um investimento antes de levantar.", 'error');
      return;
    }

    const totalAvailable = user.balance + user.referralEarnings;
    
    if (amount > totalAvailable) {
      showNotification("Saldo insuficiente.", 'error');
      return;
    }

    // Deduct balance logic (simplified)
    let remainingToDeduct = amount;
    let newBalance = user.balance;
    let newReferral = user.referralEarnings;

    if (newBalance >= remainingToDeduct) {
        newBalance -= remainingToDeduct;
    } else {
        remainingToDeduct -= newBalance;
        newBalance = 0;
        newReferral -= remainingToDeduct;
    }

    setUser({
        ...user,
        balance: newBalance,
        referralEarnings: newReferral
    });

    const newTx: Transaction = {
      id: `wd-${Date.now()}`,
      type: 'withdrawal',
      amount,
      status: 'pending',
      date: new Date().toISOString(),
      method
    };
    setTransactions(prev => [newTx, ...prev]);
    showNotification("Pedido de levantamento realizado!", 'success');
    setCurrentView('dashboard');
  };

  const handleInvest = (planId: number) => {
    if (!user) return;
    const plan = INVESTMENT_PLANS.find(p => p.id === planId);
    if (!plan) return;

    const totalLiquidity = user.balance + user.bonus + user.referralEarnings;

    if (totalLiquidity >= plan.price) {
        let cost = plan.price;
        let newBonus = user.bonus;
        let newBalance = user.balance;
        let newReferral = user.referralEarnings;

        // Use bonus first
        if (newBonus > 0) {
            const used = Math.min(newBonus, cost);
            newBonus -= used;
            cost -= used;
        }
        
        // Use balance
        if (cost > 0 && newBalance > 0) {
             const used = Math.min(newBalance, cost);
             newBalance -= used;
             cost -= used;
        }

        // Use referral
        if (cost > 0 && newReferral > 0) {
            const used = Math.min(newReferral, cost);
            newReferral -= used;
            cost -= used;
        }

        if (cost > 0) {
             showNotification("Saldo insuficiente. Por favor faz um depósito.", 'error');
             setCurrentView('deposit');
             return;
        }

        const newPlan: ActivePlan = {
            id: `plan-${Date.now()}`,
            planId: plan.id,
            startDate: new Date().toISOString(),
            daysRemaining: plan.duration
        };

        setUser({
            ...user,
            bonus: newBonus,
            balance: newBalance,
            referralEarnings: newReferral,
            hasInvested: true,
            activePlans: [...user.activePlans, newPlan]
        });

        showNotification(`Investimento no plano ${plan.name} realizado com sucesso!`, 'success');
        setCurrentView('dashboard');

    } else {
        showNotification("Saldo insuficiente. Por favor faz um depósito.", 'error');
        setCurrentView('deposit');
    }
  };

  // Easter egg: Cheat to add money for testing
  const debugAddMoney = () => {
      if(user) {
          setUser({...user, balance: user.balance + 5000});
          showNotification("Modo Demo: 5.000 MT adicionados", 'success');
      }
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans pb-20 md:pb-0 relative overflow-hidden">
      
      {/* Notification Toast */}
      {notification && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-out ${notification.type === 'success' ? 'bg-green-600' : 'bg-red-600'}`}>
          {notification.message}
        </div>
      )}

      {currentView === 'landing' && (
        <LandingPage onStart={handleStart} />
      )}

      {currentView === 'auth' && (
        <Auth 
            onLogin={handleLogin} 
            onBack={() => setCurrentView('landing')} 
            initialIsRegister={isAuthRegister}
        />
      )}

      {user && currentView !== 'landing' && currentView !== 'auth' && (
        <>
            <div className="max-w-md mx-auto min-h-screen bg-gray-100 shadow-2xl overflow-hidden relative">
                 <Dashboard 
                    view={currentView} 
                    user={user} 
                    transactions={transactions}
                    onChangeView={setCurrentView}
                    onInvest={handleInvest}
                    onDeposit={handleDeposit}
                    onWithdraw={handleWithdraw}
                    debugAddMoney={debugAddMoney}
                 />
                 <Navigation currentView={currentView} onChangeView={setCurrentView} onLogout={handleLogout} />
            </div>
        </>
      )}
    </div>
  );
};

export default App;
