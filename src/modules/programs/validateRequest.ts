import { Request, Response, NextFunction } from 'express';
import { ZodTypeAny } from 'zod';

const validateRequest =
  (schema: ZodTypeAny) => (req: Request, _res: Response, next: NextFunction) => {
    schema.parse({
      body: req.body,
    });

    next();
  };

export default validateRequest;
