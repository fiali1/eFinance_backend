import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const { JWT_SECRET } = process.env;

interface TokenContent {
  username: string;
}

interface CustomReq extends Request {
  username: string;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(403).send('Erro de cabeçalho');
  }

  if (!JWT_SECRET) {
    return res.status(500).send('Erro na validação');
  }

  try {
    const { username } = jwt.verify(token, JWT_SECRET) as TokenContent;
    (req as CustomReq).username = username;

    return next();
  } catch (error) {
    return res.status(401).send('Forneça uma autenticação válida');
  }
};
