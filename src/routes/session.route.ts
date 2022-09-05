import { Router } from 'express';
import { doc, getDoc } from 'firebase/firestore';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { db } from '../services/firestore';

const { JWT_SECRET } = process.env;

if (!JWT_SECRET) {
  throw new Error('Environment variables not provided');
}

const sessionRoutes = Router();

sessionRoutes.post('/login', async (req, res) => {
  const { username, password } = req.body;

  try {
    const userRef = doc(db, 'users', username);
    const userSnapshot = await getDoc(userRef);
    const user = userSnapshot.data();

    if (!user) {
      return res.status(400).send('Usuário ou senha inválidos');
    }

    const passwordCheck = await bcrypt.compare(password, user.password);

    if (!passwordCheck) {
      return res.status(400).send('Usuário ou senha inválidos');
    }

    const token: string = jwt.sign(
      { username: user.username, name: user.name },
      JWT_SECRET
    );

    return res.status(200).send(token);
  } catch (error) {
    return res.status(500).send('Ocorreu um erro ao fazer login');
  }
});

export { sessionRoutes };
