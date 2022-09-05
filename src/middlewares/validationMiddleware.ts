import { NextFunction, Request, Response } from 'express';
import { SchemaOf } from 'yup';

const validate =
  (schema: SchemaOf<unknown>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    const { body } = req;

    try {
      await schema.validate(body);
      return next();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      return res.status(400).send(error.message);
    }
  };

export { validate };
