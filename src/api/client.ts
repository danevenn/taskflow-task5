import type {
  ApiErrorBody,
  CalcRequest,
  CalcResponse,
  CreateExpenseInput,
  CreateScenarioInput,
  Expense,
  Scenario,
  UpdateExpenseInput,
} from '../types/api';

const API_BASE =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api/v1';

export class ApiError extends Error {
  status: number;
  code?: string;
  details?: Record<string, string>;
  constructor(message: string, status: number, body?: ApiErrorBody) {
    super(message);
    this.status = status;
    this.code = body?.code;
    this.details = body?.details;
  }
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${path}`;
  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
    });
  } catch (err) {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica tu conexión.',
      0,
    );
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const text = await res.text();
  const data = text ? (JSON.parse(text) as unknown) : undefined;

  if (!res.ok) {
    const body = data as ApiErrorBody | undefined;
    throw new ApiError(
      body?.message ?? `Error ${res.status}`,
      res.status,
      body,
    );
  }

  return data as T;
}

export const api = {
  health(): Promise<{ status: string; uptime: number }> {
    return request('/health');
  },

  listExpenses(): Promise<Expense[]> {
    return request<Expense[]>('/expenses');
  },
  createExpense(input: CreateExpenseInput): Promise<Expense> {
    return request<Expense>('/expenses', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  updateExpense(id: string, input: UpdateExpenseInput): Promise<Expense> {
    return request<Expense>(`/expenses/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  },
  deleteExpense(id: string): Promise<void> {
    return request<void>(`/expenses/${id}`, { method: 'DELETE' });
  },

  listScenarios(): Promise<Scenario[]> {
    return request<Scenario[]>('/scenarios');
  },
  createScenario(input: CreateScenarioInput): Promise<Scenario> {
    return request<Scenario>('/scenarios', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
  deleteScenario(id: string): Promise<void> {
    return request<void>(`/scenarios/${id}`, { method: 'DELETE' });
  },

  calculate(input: CalcRequest): Promise<CalcResponse> {
    return request<CalcResponse>('/calc', {
      method: 'POST',
      body: JSON.stringify(input),
    });
  },
};
