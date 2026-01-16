import { useState, useEffect, useCallback, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import createContextHook from '@nkzw/create-context-hook';
import { Operation, Expense, Sector } from '@/types';
import { defaultOperations, mockExpenses, subscriptionPlans, defaultSectors } from '@/mocks/data';

const STORAGE_KEYS = {
  SECTORS: '@agrofinance_sectors',
  OPERATIONS: '@agrofinance_operations',
  EXPENSES: '@agrofinance_expenses',
  SUBSCRIPTION: '@agrofinance_subscription',
};

export const [AppProvider, useApp] = createContextHook(() => {
  const [sectors, setSectors] = useState<Sector[]>(defaultSectors);
  const [operations, setOperations] = useState<Operation[]>(defaultOperations);
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPlanId, setCurrentPlanId] = useState<string>('free');

  const currentPlan = useMemo(() => {
    return subscriptionPlans.find(p => p.id === currentPlanId) || subscriptionPlans[0];
  }, [currentPlanId]);

  const canAddOperation = useMemo(() => {
    if (currentPlan.operationsLimit === -1) return true;
    return operations.length < currentPlan.operationsLimit;
  }, [operations.length, currentPlan]);

  const isPremiumFeature = useCallback((feature: 'reports' | 'export' | 'verification' | 'multiUser') => {
    if (currentPlanId === 'free') {
      return true;
    }
    if (currentPlanId === 'starter') {
      return feature === 'export' || feature === 'multiUser';
    }
    return false;
  }, [currentPlanId]);

  useEffect(() => {
    loadData();
  }, []);

  const upgradePlan = useCallback(async (planId: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SUBSCRIPTION, planId);
      setCurrentPlanId(planId);
    } catch (error) {
      console.log('Error saving subscription:', error);
    }
  }, []);

  const loadData = async () => {
    try {
      const [storedSectors, storedOperations, storedExpenses, storedSubscription] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.SECTORS),
        AsyncStorage.getItem(STORAGE_KEYS.OPERATIONS),
        AsyncStorage.getItem(STORAGE_KEYS.EXPENSES),
        AsyncStorage.getItem(STORAGE_KEYS.SUBSCRIPTION),
      ]);

      if (storedSectors) {
        setSectors(JSON.parse(storedSectors));
      }
      if (storedOperations) {
        setOperations(JSON.parse(storedOperations));
      }
      if (storedExpenses) {
        setExpenses(JSON.parse(storedExpenses));
      }
      if (storedSubscription) {
        setCurrentPlanId(storedSubscription);
      }
    } catch (error) {
      console.log('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSectors = async (newSectors: Sector[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SECTORS, JSON.stringify(newSectors));
      setSectors(newSectors);
    } catch (error) {
      console.log('Error saving sectors:', error);
    }
  };

  const addSector = useCallback((sector: Omit<Sector, 'id' | 'createdAt'>) => {
    const newSector: Sector = {
      ...sector,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...sectors, newSector];
    saveSectors(updated);
    return newSector;
  }, [sectors]);

  const updateSector = useCallback((id: string, updates: Partial<Sector>) => {
    const updated = sectors.map(s => s.id === id ? { ...s, ...updates } : s);
    saveSectors(updated);
  }, [sectors]);

  const deleteSector = useCallback((id: string) => {
    const updated = sectors.filter(s => s.id !== id);
    saveSectors(updated);
  }, [sectors]);

  const getSectorById = useCallback((id: string) => {
    return sectors.find(s => s.id === id);
  }, [sectors]);

  const getOperationsBySector = useCallback((sectorId: string) => {
    return operations.filter(op => op.sectorId === sectorId);
  }, [operations]);

  const saveOperations = async (newOperations: Operation[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.OPERATIONS, JSON.stringify(newOperations));
      setOperations(newOperations);
    } catch (error) {
      console.log('Error saving operations:', error);
    }
  };

  const saveExpenses = async (newExpenses: Expense[]) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(newExpenses));
      setExpenses(newExpenses);
    } catch (error) {
      console.log('Error saving expenses:', error);
    }
  };

  const addOperation = useCallback((operation: Omit<Operation, 'id' | 'createdAt'>) => {
    const newOperation: Operation = {
      ...operation,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...operations, newOperation];
    saveOperations(updated);
    return newOperation;
  }, [operations]);

  const updateOperation = useCallback((id: string, updates: Partial<Operation>) => {
    const updated = operations.map(op => 
      op.id === id ? { ...op, ...updates } : op
    );
    saveOperations(updated);
  }, [operations]);

  const deleteOperation = useCallback((id: string) => {
    const updated = operations.filter(op => op.id !== id);
    saveOperations(updated);
  }, [operations]);

  const addExpense = useCallback((expense: Omit<Expense, 'id' | 'createdAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [...expenses, newExpense];
    saveExpenses(updated);
    return newExpense;
  }, [expenses]);

  const updateExpense = useCallback((id: string, updates: Partial<Expense>) => {
    const updated = expenses.map(exp => 
      exp.id === id ? { ...exp, ...updates } : exp
    );
    saveExpenses(updated);
  }, [expenses]);

  const deleteExpense = useCallback((id: string) => {
    const updated = expenses.filter(exp => exp.id !== id);
    saveExpenses(updated);
  }, [expenses]);

  const getOperationById = useCallback((id: string) => {
    return operations.find(op => op.id === id);
  }, [operations]);

  const getExpensesByOperation = useCallback((operationId: string) => {
    return expenses.filter(exp => exp.operationId === operationId);
  }, [expenses]);

  const getExpensesByStatus = useCallback((status: Expense['status']) => {
    return expenses.filter(exp => exp.status === status);
  }, [expenses]);

  const getPendingVerification = useMemo(() => {
    return expenses.filter(exp => exp.status === 'pending' || exp.status === 'discrepancy');
  }, [expenses]);

  const getTotalByOperation = useCallback((operationId: string) => {
    return expenses
      .filter(exp => exp.operationId === operationId)
      .reduce((sum, exp) => sum + exp.agreedValue, 0);
  }, [expenses]);

  const getMonthlyTotal = useMemo(() => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();
    
    return expenses
      .filter(exp => {
        const expDate = new Date(exp.createdAt);
        return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
      })
      .reduce((sum, exp) => sum + exp.agreedValue, 0);
  }, [expenses]);

  return {
    sectors,
    operations,
    expenses,
    isLoading,
    addSector,
    updateSector,
    deleteSector,
    getSectorById,
    getOperationsBySector,
    addOperation,
    updateOperation,
    deleteOperation,
    addExpense,
    updateExpense,
    deleteExpense,
    getOperationById,
    getExpensesByOperation,
    getExpensesByStatus,
    getPendingVerification,
    getTotalByOperation,
    getMonthlyTotal,
    currentPlan,
    currentPlanId,
    canAddOperation,
    isPremiumFeature,
    upgradePlan,
  };
});
