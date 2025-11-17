import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';

/**
 * Validation middleware
 * Checks for validation errors from express-validator
 */
export const validate = (validations: ValidationChain[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    // Execute all validations
    for (const validation of validations) {
      await validation.run(req);
    }

    const errors = validationResult(req);

    if (errors.isEmpty()) {
      next();
      return;
    }

    res.status(400).json({
      success: false,
      error: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg
      }))
    });
  };
};
