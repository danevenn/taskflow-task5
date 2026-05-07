import type { NextFunction, Request, Response } from 'express';

type Validator<T> = (body: unknown) => T;

export class ValidationError extends Error {
  details: Record<string, string>;
  constructor(details: Record<string, string>) {
    super('Validation failed');
    this.details = details;
  }
}

export const validateBody =
  <T>(validator: Validator<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = validator(req.body);
      next();
    } catch (err) {
      next(err);
    }
  };

export const requireString = (
  obj: Record<string, unknown>,
  field: string,
  errors: Record<string, string>,
  { min = 1, max = 60 } = {},
): string => {
  const value = obj[field];
  if (typeof value !== 'string' || value.trim().length < min) {
    errors[field] = `${field} debe ser un texto de al menos ${min} caracteres`;
    return '';
  }
  if (value.length > max) {
    errors[field] = `${field} no puede exceder ${max} caracteres`;
    return '';
  }
  return value.trim();
};

export const requireNumber = (
  obj: Record<string, unknown>,
  field: string,
  errors: Record<string, string>,
  { min = 0, max = 1_000_000 } = {},
): number => {
  const value = obj[field];
  const num = typeof value === 'number' ? value : Number(value);
  if (Number.isNaN(num)) {
    errors[field] = `${field} debe ser un número`;
    return 0;
  }
  if (num < min || num > max) {
    errors[field] = `${field} debe estar entre ${min} y ${max}`;
    return 0;
  }
  return num;
};

export const optionalNumber = (
  obj: Record<string, unknown>,
  field: string,
  errors: Record<string, string>,
  opts?: { min?: number; max?: number },
): number | undefined => {
  if (obj[field] === undefined || obj[field] === null || obj[field] === '') {
    return undefined;
  }
  return requireNumber(obj, field, errors, opts);
};

export const ensureValid = (errors: Record<string, string>) => {
  if (Object.keys(errors).length > 0) {
    throw new ValidationError(errors);
  }
};
