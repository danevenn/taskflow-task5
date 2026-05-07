import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

export interface DreamLifeInputs {
  monthlyExpenses: number;
  savingsGoalPct: number;
  investmentGoalPct: number;
  lifestyleExtras: number;
  taxRatePct: number;
}

interface DreamLifeContextValue {
  inputs: DreamLifeInputs;
  setInputs: (next: Partial<DreamLifeInputs>) => void;
  resetInputs: () => void;
  hydrateFromExpenses: (totalExpenses: number) => void;
}

const STORAGE_KEY = 'dreamLifeInputs:v1';

const defaultInputs: DreamLifeInputs = {
  monthlyExpenses: 1500,
  savingsGoalPct: 15,
  investmentGoalPct: 10,
  lifestyleExtras: 300,
  taxRatePct: 24,
};

const loadInitial = (): DreamLifeInputs => {
  if (typeof window === 'undefined') return defaultInputs;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultInputs;
    const parsed = JSON.parse(raw) as Partial<DreamLifeInputs>;
    return { ...defaultInputs, ...parsed };
  } catch {
    return defaultInputs;
  }
};

const DreamLifeContext = createContext<DreamLifeContextValue | undefined>(
  undefined,
);

export const DreamLifeProvider = ({ children }: { children: ReactNode }) => {
  const [inputs, setInputsState] = useState<DreamLifeInputs>(loadInitial);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(inputs));
    } catch {
      /* ignore quota errors */
    }
  }, [inputs]);

  const setInputs = useCallback((next: Partial<DreamLifeInputs>) => {
    setInputsState((prev) => ({ ...prev, ...next }));
  }, []);

  const resetInputs = useCallback(() => setInputsState(defaultInputs), []);

  const hydrateFromExpenses = useCallback((totalExpenses: number) => {
    setInputsState((prev) => ({ ...prev, monthlyExpenses: totalExpenses }));
  }, []);

  const value = useMemo<DreamLifeContextValue>(
    () => ({ inputs, setInputs, resetInputs, hydrateFromExpenses }),
    [inputs, setInputs, resetInputs, hydrateFromExpenses],
  );

  return (
    <DreamLifeContext.Provider value={value}>
      {children}
    </DreamLifeContext.Provider>
  );
};

export const useDreamLife = (): DreamLifeContextValue => {
  const ctx = useContext(DreamLifeContext);
  if (!ctx) {
    throw new Error('useDreamLife must be used inside DreamLifeProvider');
  }
  return ctx;
};
